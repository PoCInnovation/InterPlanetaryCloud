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
import {ChangeEvent, useEffect, useState} from 'react';
import {AiFillFolderAdd} from 'react-icons/ai';
import {useUserContext} from 'contexts/user';

import Button from 'components/Button';
import Modal from 'components/Modal';
import {textColorMode} from 'config/colorMode';
import {FileInfo, FolderInfo, IPCFile, IPCFolder} from '../../types/types';
import {getFileContent, getRootFolderName} from '../../utils/fileManipulation';
import FolderTree from '../../utils/folderTree';
import {useDriveContext} from "../../contexts/drive";

const UploadFolder = (): JSX.Element => {
    const {user} = useUserContext();
    const {folders, setFolders, files, setFiles} = useDriveContext();
    const [folderEvent, setFolderEvent] = useState<ChangeEvent<HTMLInputElement> | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);
    const {isOpen, onOpen, onClose} = useDisclosure();

    const isDrawer = useBreakpointValue({base: true, sm: false}) || false;
    const toast = useToast({duration: 2000, isClosable: true, id: 'ipc-upload-folder'});
    const [isDraged, setDrager] = useState(false)

    const uploadFolder = async () => {


        if (!folderEvent || !folderEvent.target.files || folderEvent.target.files.length === 0) {
            setIsLoading(false);
            return;
        }
        setIsLoading(true);

        const rootFolderName = getRootFolderName(folderEvent.target?.files[0]);
        const rootFolder: FolderInfo = {
            folderName: rootFolderName,
            folderPath: `${rootFolderName}/`,
            subFolder: [],
        };
        const folderTree = new FolderTree(rootFolder, []);
        const getAllSubDirectories = (Files: FileList) => {
            Array.prototype.forEach.call(Files, (file) => {
                folderTree.getFolderContent(file.webkitRelativePath, file.size);
            });
        };
        getAllSubDirectories(folderEvent.target.files);
        const allIpcFolders: IPCFolder[] = [];
        const allIPCFiles: IPCFile[] = [];
        let checkRoot = true;

        const getAllFolders = async (folderInfo: FolderInfo) => {
            let pathFolder = folderInfo.folderPath;
            const checkPath = pathFolder.split('/');

            checkPath.pop();
            if (checkPath.length === 1 && checkRoot) {
                pathFolder = '/';
                checkRoot = false;
            } else if (checkPath.length >= 1) {
                pathFolder = `/${pathFolder}`;
            }

            const folder: IPCFolder = {
                name: folderInfo.folderName,
                createdAt: Date.now(),
                path: pathFolder,
                logs: [
                    {
                        action: 'Folder created',
                        date: Date.now(),
                    },
                ],
            };
            allIpcFolders.push(folder);

            if (folderInfo.subFolder) {
                Array.prototype.forEach.call(folderInfo.subFolder, (subFolder) => {
                    getAllFolders(subFolder);
                });
            }
        };

        const filesContent: ArrayBuffer[] = [];

        const getAllFiles = async (fileInfo: FileInfo[], filesEvent: FileList) => {

            for (const filesEvent_ of filesEvent) {
                // eslint-disable-next-line no-await-in-loop
                const fileContent = await getFileContent(filesEvent_);
                filesContent.push(fileContent);
            }


            Array.prototype.forEach.call(fileInfo, async (file, index) => {
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

                const filePath = `${file.filePath}/`;
                const newFile: IPCFile = {
                    id: crypto.randomUUID(),
                    name: file.fileName,
                    hash: '',
                    size: file.fileSize,
                    createdAt: Date.now(),
                    encryptInfos: {key: '', iv: ''},
                    path: filePath,
                    permission: 'owner',
                    deletedAt: null,
                    logs: [
                        {
                            action: 'File created',
                            date: Date.now(),
                        },
                    ],
                };
                setFiles([...files, newFile]);
                allIPCFiles.push(newFile);

                const upload = await user.drive.upload(newFile, filesContent[index], {key: keyString, iv});
                if (!upload.success || !upload.file)
                    toast({title: upload.message, status: upload.success ? 'success' : 'error'});
                else {
                    setFiles([...files, upload.file]);
                    user.drive.files.push(upload.file);

                    await user.fullContact.files.addToContact(user.account.address, upload.file);
                }
            });
        };

        if (user.account) {
            await getAllFolders(folderTree.folders);
            const createdFolder = await user.fullContact.folders.uploadFolders(allIpcFolders);
            await getAllFiles(folderTree.files, folderEvent.target.files);
            setFolders([...folders, ...allIpcFolders])
            toast({title: createdFolder.message, status: createdFolder.success ? 'success' : 'error'});
        } else {
            toast({title: 'Failed to load account', status: 'error'});
        }
        onClose();
        setFolderEvent(undefined);
        setIsLoading(false);
    };

    useEffect(() => {
        if (folderEvent) {
            uploadFolder();
        }
    }, [folderEvent]);

    const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
    const {colorMode} = useColorMode();

    return (
        <HStack
            spacing={isDrawer ? '24px' : '12px'}
            p="8px 12px"
            borderRadius="8px"
            role="group"
            onClick={onOpen}
            w="100%"
            cursor="pointer"
            id="ipc-dashboard-upload-folder-button"
            _hover={{
                bg: colorMode === 'light' ? 'blue.50' : 'gray.750',
            }}
        >
            <Icon
                as={AiFillFolderAdd}
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
                Upload a folder
            </Text>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Upload a folder"
                CTA={
                    <Button
                        variant="primary"
                        size="lg"
                        onClick={uploadFolder}
                        isLoading={isLoading}
                        id="ipc-dashboard-upload-folder-modal-button"
                    >
                        Upload folder
                    </Button>
                }
            >
                <Input
                    type="file"
                    h="100%"
                    w="100%"
                    p="10px"
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setFolderEvent(e)}
                    id="ipc-dashboard-upload-folder"
                    multiple
                    // @ts-expect-error Webkitdirectory is needed for the upload of folders in the file explorer.
                    webkitdirectory={''}
                    onDragOver={() => setDrager(true)}
                    onDragLeave={() => setDrager(false)}
                    required autocomplete={"off"}
                    style={{
                        ...(!isDraged ? {} : {
                                border: '2px dashed #ccc',
                                borderRadius: '8px',
                                textAlign: 'center',
                                backgroundColor: 'lightgray',
                                color: '#333',
                                transition: 'border-color 0.3s ease, background-color 0.3s ease',
                                cursor: 'pointer',
                                opacity: 1
                            }),
                    }}
                    title={isDraged ? "Upload a folder" : "Drag your folder here"}
                />
            </Modal>
        </HStack>
    );
};

export default UploadFolder;
