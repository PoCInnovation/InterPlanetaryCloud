import {
    Box,
    Drawer,
    DrawerBody,
    DrawerContent,
    DrawerOverlay,
    Popover,
    PopoverBody,
    PopoverContent,
    PopoverTrigger,
    Portal,
    useDisclosure,
    VStack,
} from '@chakra-ui/react';
import {useEffect} from 'react';

import DeleteFile from 'components/file/DeleteFile';
import DetailsFile from 'components/file/detailsFile/DetailsFile';
import DownloadFile from 'components/file/DownloadFile';
import MoveFile from 'components/file/MoveFile';
import RenameFile from 'components/file/RenameFile';
import RestoreFile from 'components/file/RestoreFile';
import ShareFile from 'components/file/ShareFile';
import UpdateContentFile from 'components/file/UpdateContentFile';

import {IPCFile} from 'types/types';

import {useConfigContext} from 'contexts/config';
import SendEmailFile from "../file/SendEmailFile";

const FileOptionsContent = ({
                                file,
                                files,
                                onClose,
                            }: {
    file: IPCFile;
    files: IPCFile[];
    onClose: () => void;
}): JSX.Element => (
    <>
        {file.deletedAt ? (
            <RestoreFile file={file} concernedFiles={files} onClose={onClose}/>
        ) : (
            <>
                <DownloadFile file={file} onClose={onClose}/>
                <ShareFile file={file} onClosePopover={onClose}/>
                <MoveFile file={file} onClosePopover={onClose}/>
                <RenameFile file={file} concernedFiles={files} onClosePopover={onClose}/>
                <UpdateContentFile file={file} onClosePopover={onClose}/>
                <SendEmailFile file={file} onClosePopover={onClose}/>
            </>
        )}
        <DetailsFile file={file} onClosePopover={onClose}/>
        <DeleteFile file={file} concernedFiles={files} onClosePopover={onClose}/>
    </>
);

const FileOptionsPopover = ({
                                file,
                                files,
                                clickPosition,
                                popoverOpeningToggle,
                                popoverOpeningHandler,
                            }: {
    file: IPCFile;
    files: IPCFile[];
    clickPosition: { x: number; y: number };
    popoverOpeningToggle: boolean;
    popoverOpeningHandler: () => void;
}): JSX.Element => {
    const {config} = useConfigContext();
    const {isOpen, onOpen, onClose} = useDisclosure();

    useEffect(() => {
        if (popoverOpeningToggle) {
            popoverOpeningHandler();
            onOpen();
        }
    }, [popoverOpeningToggle]);

    return (
        <Popover placement="right-start" isOpen={isOpen} onClose={() => onClose()}>
            <PopoverTrigger>
                <Box position="fixed" w="1px" h="1px" bg="transparent" top={clickPosition.y} left={clickPosition.x}/>
            </PopoverTrigger>
            <Portal>
                <PopoverContent
                    w="250px"
                    backgroundColor={config?.theme.value ?? 'white'}
                    borderRadius="8px"
                    border="2px solid #E8EBFF"
                    _focus={{
                        boxShadow: 'none',
                    }}
                >
                    <PopoverBody p="8px">
                        <VStack w="100%" spacing="4px">
                            <FileOptionsContent file={file} files={files} onClose={onClose}/>
                        </VStack>
                    </PopoverBody>
                </PopoverContent>
            </Portal>
        </Popover>
    );
};

const FileOptionsDrawer = ({
                               file,
                               files,
                               isOpen,
                               onClose,
                           }: {
    file: IPCFile;
    files: IPCFile[];
    isOpen: boolean;
    onClose: () => void;
}): JSX.Element => (
    <Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
        <DrawerOverlay/>
        <DrawerContent borderRadius="16px 16px 0px 0px">
            <DrawerBody px="16px" py="32px">
                <VStack w="100%" spacing="12px">
                    <FileOptionsContent file={file} files={files} onClose={onClose}/>
                </VStack>
            </DrawerBody>
        </DrawerContent>
    </Drawer>
);

export {FileOptionsPopover, FileOptionsDrawer};
