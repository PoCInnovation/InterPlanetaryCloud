import {ArrowBackIcon, ChevronRightIcon} from '@chakra-ui/icons';
import {
	Divider,
	HStack,
	Icon,
	Text,
	useBreakpointValue,
	useColorMode,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import {useEffect, useState} from 'react';
import {FcFolder} from 'react-icons/fc';
import {MdOutlineDriveFileMove} from 'react-icons/md';

import Modal from 'components/Models/Modal';

import {useDriveContext} from 'contexts/drive';
import {useUserContext} from 'contexts/user';

import Button from 'components/Models/Button';
import type {IPCFolder} from 'types/types';
import {textColorMode} from 'config/colorMode';

type MoveFolderProps = {
  folder: IPCFolder;
};

const MoveFolder = ({folder}: MoveFolderProps): JSX.Element => {
  const {user} = useUserContext();
  const {files, setFiles, folders, setFolders} = useDriveContext();
  const [hasPermission, setHasPermission] = useState(false);
  const toast = useToast({duration: 2000, isClosable: true});

  const isDrawer = useBreakpointValue({base: true, sm: false}) || false;

  const [newPath, setNewPath] = useState('/');
  const [isLoading, setIsLoading] = useState(false);
  const {isOpen, onOpen, onClose} = useDisclosure();

  useEffect(() => {
    setHasPermission(true);
    return () => {
      setHasPermission(false);
      setNewPath('/');
    };
  }, []);

  const moveFolder = async () => {
    setIsLoading(true);
    const fullPath = `${folder.path}${folder.name}/`;

    const moved = await user.fullContact.folders.move(folder, newPath);

    toast({title: moved.message, status: moved.success ? 'success' : 'error'});
    setFiles(
      files.map((f) => {
        if (f.path.startsWith(fullPath))
          return {
            ...f,
            path: f.path.replace(folder.path, newPath),
            logs: [
              ...f.logs,
              {
                action: `Moved folder to ${fullPath}`,
                date: Date.now(),
              },
            ],
          };
        return f;
      }),
    );

    setFolders(
      folders.map((f) => {
        if (f.path.startsWith(fullPath)) return {...f, path: f.path.replace(folder.path, newPath)};
        if (f === folder) return {...f, path: newPath};
        return f;
      }),
    );

    setNewPath('/');
    setIsLoading(false);
    onClose();
  };

  const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
  const {colorMode} = useColorMode();

  if (!hasPermission) return <></>;

  return (
    <HStack
      spacing={isDrawer ? '24px' : '12px'}
      p="8px 12px"
      borderRadius="8px"
      role="group"
      onClick={onOpen}
      w="100%"
      cursor="pointer"
      id="ipc-dashboard-move-button"
      _hover={{
        bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
      }}
    >
      <Icon
        as={MdOutlineDriveFileMove}
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
        Move to...
      </Text>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title="Move folder"
        CTA={
          <Button
            variant="primary"
            size="lg"
            onClick={moveFolder}
            isLoading={isLoading}
            id="ipc-dashboard-move-folder-confirm"
          >
            Move
          </Button>
        }
      >
        <>
          <Button
            variant="secondary"
            size="sm"
            disabled={newPath === '/'}
            onClick={() => setNewPath(newPath.replace(/([^/]+)\/$/, ''))}
            id="ipc-move-folder-back-path-button"
          >
            <ArrowBackIcon fontSize="30"/>
          </Button>
          <br/>
          <br/>
          {folders.filter((f) => f.path === newPath && f.createdAt !== folder.createdAt).length ? (
            folders
              .filter((f) => f.path === newPath)
              .map((f) => (
                <div key={f.createdAt}>
                  <Divider/>
                  <HStack>
                    <Button
                      backgroundColor={'white'}
                      w="100%"
                      onClick={() => {
                        setNewPath(`${newPath}${f.name}/`);
                      }}
                    >
                      <FcFolder display="flex" size="30"></FcFolder>
                      {f.name}
                      <ChevronRightIcon/>
                    </Button>
                  </HStack>
                  <Divider/>
                </div>
              ))
          ) : (
            <>
              <Divider/>
              <HStack>
                <Button backgroundColor={'white'} w="100%">
                  No folders
                </Button>
              </HStack>
              <Divider/>
            </>
          )}
        </>
      </Modal>
    </HStack>
  );
};

export default MoveFolder;
