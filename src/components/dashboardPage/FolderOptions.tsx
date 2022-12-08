import { Box, Drawer, DrawerBody, DrawerContent, DrawerOverlay, PopoverTrigger, Popover, useDisclosure, VStack, PopoverContent, Portal, PopoverBody } from "@chakra-ui/react";
import { useEffect } from "react";
import { IPCFolder } from "../../types/types";
import MoveFolder from "../folder/MoveFolder";
import DeleteFolder from "../folder/DeleteFolder";
import { useConfigContext } from "../../contexts/config";

const FolderOptionsContent = ({folder}: {folder: IPCFolder}): JSX.Element => (
	<>
		<MoveFolder folder={folder} />
		<DeleteFolder folder={folder} />
	</>
)

const FolderOptionsPopover = ({folder, clickPosition, popoverOpeningToggle, popoverOpeningHandler}: {
	folder: IPCFolder;
	clickPosition: {x: number, y: number};
	popoverOpeningToggle: boolean;
	popoverOpeningHandler: () => void;
}): JSX.Element => {
	const { config } = useConfigContext();
	const { isOpen, onOpen, onClose } = useDisclosure();

	useEffect(() => {
		if (popoverOpeningToggle) {
			popoverOpeningHandler();
			onOpen();
		}
	}, [popoverOpeningToggle]);

	return (
		<Popover placement="right-start" isOpen={isOpen} onClose={() => onClose()}>
			<PopoverTrigger>
				<Box position="absolute" w="1px" h="1px" bg="transparent" top={clickPosition.y}
				     left={clickPosition.x} />
			</PopoverTrigger>
			<Portal>
				<PopoverContent
					w="250px"
					backgroundColor={config?.theme ?? 'white'}
					borderRadius="8px"
					border="2px solid #E8EBFF"
					_focus={{
						boxShadow: 'none',
					}}
				>
					<PopoverBody p="8px">
						<VStack w="100%" spacing="4px">
							<FolderOptionsContent folder={folder} />
						</VStack>
					</PopoverBody>
				</PopoverContent>
			</Portal>
		</Popover>
	)
};

const FolderOptionsDrawer = ({ folder, isOpen, onClose }: {folder: IPCFolder, isOpen: boolean, onClose: () => void}): JSX.Element => (
		<Drawer isOpen={isOpen} onClose={onClose} placement="bottom">
			<DrawerOverlay />
			<DrawerContent borderRadius="16px 16px 0px 0px">
				<DrawerBody px="16px" py="32px">
					<VStack w="100%" spacing="12px">
							<FolderOptionsContent folder={folder} />
						</VStack>
					</DrawerBody>
				</DrawerContent>
		</Drawer>
	)

export { FolderOptionsPopover, FolderOptionsDrawer };