import {Button, Text, useColorModeValue, useDisclosure, useToast} from "@chakra-ui/react";
import {useState} from "react";

import Modal from "components/Modal";

import {useUserContext} from "contexts/user";
import {useDriveContext} from "contexts/drive";

import {IPCFile, IPCFolder} from "types/types";

type DeleteBinProps = {
    files: IPCFile[];
    folders: IPCFolder[];
    concernedFiles: IPCFile[];
};

const DeleteBin = ({ files, folders, concernedFiles }: DeleteBinProps): JSX.Element => {
    const colorText = useColorModeValue('gray.800', 'white');
    const toast = useToast({ duration: 2000, isClosable: true });

    const { user } = useUserContext();
    const { setFiles } = useDriveContext()

    const [isLoading, setIsLoading] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    const deleteAllFiles = async () => {
        setIsLoading(true);
        if (user.account) {
            const deleted = await user.drive.delete(files.map((file) => file.hash));
            if (deleted.success) {
                const removed = await user.contact.deleteFiles(files.map((file) => file.id), concernedFiles);

                if (!removed.success) {
                    toast({ title: removed.message, status: 'error' });
                } else {
                    setFiles(user.drive.files);
                    toast( { title: "All the files in your bin have been deleted.", status: 'success' })
                }
            }
        } else {
            toast({ title: 'Failed to load account', status: 'error' });
        }
        setIsLoading(false);
        onClose();
    }

    if (files.length === 0 && folders.length === 0) {
        return (
            <Text fontSize="24" textColor={colorText}>
                Your bin is empty
            </Text>
        )
    }

    return (
        <>
            <Button
                variant="inline"
                onClick={() => onOpen()}
            >
                Delete all files
            </Button>
            <Modal
                isOpen={isOpen}
                onClose={onClose}
                title="Delete the bin"
                CTA={
                    <Button
                        variant="inline"
                        w="100%"
                        mb="16px"
                        onClick={async () => deleteAllFiles()}
                        isLoading={isLoading}
                        id="ipc-dashboard-delete-bin-button"
                    >
                        Delete
                    </Button>
                }
            >
                <Text>Are you sure you want to delete all the files in your bin?</Text>
            </Modal>
        </>
    )
}

export default DeleteBin