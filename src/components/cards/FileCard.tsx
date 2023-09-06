import {Box, HStack, Text, useBreakpointValue, useColorModeValue, useDisclosure} from '@chakra-ui/react';
import {useState} from 'react';
import {BsFileEarmarkFill} from 'react-icons/bs';
import {
    BiLogoCPlusPlus,
    BiLogoCss3,
    BiLogoFlutter,
    BiLogoGoLang,
    BiLogoHtml5,
    BiLogoJavascript,
    BiLogoPython,
    BiLogoReact,
    BiLogoTypescript,
    BiText
} from "react-icons/bi";
import {VscTerminalBash} from "react-icons/vsc";
import {FaRust} from "react-icons/fa";
import {IPCFile} from 'types/types';
import {DiHaskell} from "react-icons/di";
import {SiYaml} from "react-icons/si";
import useToggle from 'hooks/useToggle';

import {useDriveContext} from 'contexts/drive';
import {useUserContext} from 'contexts/user';

import formatDate from 'utils/formatDate';
import formatFileSize from 'utils/formatFileSize';

import {FileOptionsDrawer, FileOptionsPopover} from 'components/dashboardPage/FileOptions';

import {textColorMode} from 'config/colorMode';

import Card from './Card';

const fileTypePreview = (fileName: string) => {
    const fileIcons: { [key: string]: React.ReactElement } = {
        '.py': <BiLogoPython size={"24px"}/>,
        '.ts': <BiLogoTypescript size={"24px"}/>,
        '.js': <BiLogoJavascript size={"24px"}/>,
        '.cpp': <BiLogoCPlusPlus size={"24px"}/>,
        '.hpp': <BiLogoCPlusPlus size={"24px"}/>,
        '.css': <BiLogoCss3 size={"24px"}/>,
        '.html': <BiLogoHtml5 size={"24px"}/>,
        '.tsx': <BiLogoReact size={"24px"}/>,
        '.jsx': <BiLogoReact size={"24px"}/>,
        '.go': <BiLogoGoLang size={"24px"}/>,
        '.dart': <BiLogoFlutter size={"24px"}/>,
        '.txt': <BiText size={"24px"}/>,
        '.sh': <VscTerminalBash size={"24px"}/>,
        '.rs': <FaRust size={"24px"}/>,
        '.hs': <DiHaskell size={"24px"}/>,
        '.lhs': <DiHaskell size={"24px"}/>,
        '.yml': <SiYaml size={"24px"}/>
    };

    const fileExtension: string = fileName.slice(fileName.lastIndexOf('.') + 1);

    if (fileIcons[`.${fileExtension}`]) {
        return fileIcons[`.${fileExtension}`];
    }
    return <BsFileEarmarkFill size="24px"/>;
};

const FileCard = ({file}: { file: IPCFile }): JSX.Element => {
    const {files} = useDriveContext();
    const {
        user: {
            fullContact: {
                contact: {username},
            },
        },
    } = useUserContext();

    const {isOpen: isOpenFile, onOpen: onOpenFile, onClose: onCloseFile} = useDisclosure();
    const {toggle: popoverOpeningToggleFile, toggleHandler: popoverOpeningHandlerFile} = useToggle();

    const [clickPosition, setClickPosition] = useState({x: 0, y: 0});

    const isDrawer = useBreakpointValue({base: true, sm: false}) || false;
    const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);
    const icon = fileTypePreview(file.name);
    return (
        <>
            <Card
                key={file.createdAt}
                className="ipc-file-popover-button"
                onContextMenu={(e) => {
                    e.preventDefault();
                    if (!isDrawer) {
                        setClickPosition({x: e.clientX, y: e.clientY});
                        popoverOpeningHandlerFile();
                    } else onOpenFile();
                }}
            >
                <HStack w="100%" justify="space-between">
                    <HStack spacing="16px">
                        {icon}
                        <Text color={textColor} size="lg">
                            {file.name}
                        </Text>
                    </HStack>
                    <HStack spacing="32px">
                        <Text color={textColor}>
                            by{' '}
                            <Box as="span" fontWeight="600">
                                {username}
                            </Box>
                        </Text>
                        <Text color={textColor}>{formatDate(file.createdAt)}</Text>
                        <Text color={textColor}>{formatFileSize(file.size)}</Text>
                    </HStack>
                </HStack>
            </Card>
            <Box>
                {isDrawer ? (
                    <FileOptionsDrawer file={file} files={files} isOpen={isOpenFile} onClose={onCloseFile}/>
                ) : (
                    <FileOptionsPopover
                        file={file}
                        files={files}
                        clickPosition={clickPosition}
                        popoverOpeningToggle={popoverOpeningToggleFile}
                        popoverOpeningHandler={popoverOpeningHandlerFile}
                    />
                )}
            </Box>
        </>
    );
};

export default FileCard;
