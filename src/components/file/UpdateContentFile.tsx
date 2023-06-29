import {
	HStack,
	Icon,
	Input,
	Text,
	useBreakpointValue,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import {ChangeEvent, useState} from 'react';
import {GoSync} from 'react-icons/go';

import {getFileContent} from 'utils/fileManipulation';

import {useDriveContext} from 'contexts/drive';
import {useUserContext} from 'contexts/user';

import Button from 'components/Models/Button';
import Modal from 'components/Models/Modal';
import type {IPCFile} from 'types/types';
import {textColorMode} from 'config/colorMode';

type UpdateContentFileProps = {
  file: IPCFile;
  onClosePopover: () => void;
};

const UpdateContentFile = ({file, onClosePopover}: UpdateContentFileProps): JSX.Element => {
  const {user} = useUserContext();
  const {files, setFiles} = useDriveContext();

  const [fileEvent, setFileEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();

  const isDrawer = useBreakpointValue({base: true, sm: false}) || false;
  const toast = useToast({duration: 2000, isClosable: true});

  const updateContent = async () => {
    if (!fileEvent) return;
    setIsLoading(true);

    const oldFile = file;
    const fileContent = await getFileContent(fileEvent.target.files ? fileEvent.target.files[0] : []);

    if (!fileContent) return;

    const cryptoKey = await crypto.subtle.generateKey(
      {
        name: 'AES-GCM',
        length: 256,
      },
      true,
      ['encrypt', 'decrypt'],
    );
    const keyString = await crypto.subtle.exportKey('raw', cryptoKey);
    const iv = crypto.getRandomValues(new Uint8Array(128));

    const newFile: IPCFile = {
      ...oldFile,
      size: fileEvent.target.files![0].size,
      logs: [
        ...oldFile.logs,
        {
          action: 'Edit file content',
          date: Date.now(),
        },
      ],
    };
    const upload = await user.drive.upload(newFile, fileContent, {key: keyString, iv});
    if (!upload.success || !upload.file) {
      toast({title: upload.message, status: upload.success ? 'success' : 'error'});
    } else {
      const updated = await user.fullContact.files.updateContent(upload.file);
      toast({title: updated.message, status: updated.success ? 'success' : 'error'});
      if (updated.success && upload.file) {
        const index = files.indexOf(oldFile);
        if (index !== -1) files[index] = upload.file;
        setFiles(files);

        await user.drive.delete([oldFile.hash]);
      }
    }
    setIsLoading(false);
    onClose();
    onClosePopover();
  };

  const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
  const {colorMode} = useColorMode();

  if (!['owner', 'editor'].includes(file.permission)) return <></>;

  return (
    <HStack
      spacing={isDrawer ? '24px' : '12px'}
      p="8px 12px"
      borderRadius="8px"
      role="group"
      onClick={onOpen}
      w="100%"
      cursor="pointer"
      id="ipc-dashboard-update-button"
      _hover={{
        bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
      }}
    >
      <Icon
        as={GoSync}
        _groupHover={{color: 'red.800'}}
        w={isDrawer ? '24px' : '20px'}
        h={isDrawer ? '24px' : '20px'}
      />
      <Text
        fontSize="16px"
        fontWeight="400"
        _groupHover={{
          color: 'red.800',
          fontWeight: '500',
        }}
        color={textColor}
      >
        Update the content
      </Text>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Update file content from a file"
        CTA={
          <Button
            variant="primary"
            size="lg"
            onClick={updateContent}
            isLoading={isLoading}
            id="ipc-dashboard-update-file-content-button"
          >
            Upload new version
          </Button>
        }
      >
        <Input
          type="file"
          h="100%"
          w="100%"
          p="10px"
          onChange={(e: ChangeEvent<HTMLInputElement>) => setFileEvent(e)}
          id="ipc-dashboard-input-new-file-content"
        />
      </Modal>
    </HStack>
  );
};

export default UpdateContentFile;
