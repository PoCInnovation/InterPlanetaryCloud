import {Box, HStack, Text, useBreakpointValue, useColorModeValue, useDisclosure} from '@chakra-ui/react';
import {useState} from 'react';
import {BsFillFilePersonFill} from 'react-icons/bs';

import {IPCContact} from 'types/types';

import useToggle from 'hooks/useToggle';

import formatDate from 'utils/formatDate';

import {ContactOptionsDrawer, ContactOptionsPopover} from 'components/Pages/dashboardPage/ContactOptions';

import {textColorMode} from 'config/colorMode';

import Card from './Card';

const ContactCard = ({contact}: { contact: IPCContact }): JSX.Element => {
  const {isOpen: isOpenFile, onOpen: onOpenFile, onClose: onCloseFile} = useDisclosure();
  const {toggle: popoverOpeningToggleFile, toggleHandler: popoverOpeningHandlerFile} = useToggle();

  const [clickPosition, setClickPosition] = useState({x: 0, y: 0});

  const isDrawer = useBreakpointValue({base: true, sm: false}) || false;
  const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

  return (
    <>
      <Card
        key={contact.address}
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
            <BsFillFilePersonFill size="24px"/>
            <Text color={textColor} size="lg">
              {contact.name} - {contact.address}
            </Text>
          </HStack>
          <HStack spacing="32px">
            <Text color={textColor}>{formatDate(contact.createdAt)}</Text>
          </HStack>
        </HStack>
      </Card>
      <Box>
        {isDrawer ? (
          <ContactOptionsDrawer contact={contact} isOpen={isOpenFile} onClose={onCloseFile}/>
        ) : (
          <ContactOptionsPopover
            contact={contact}
            clickPosition={clickPosition}
            popoverOpeningToggle={popoverOpeningToggleFile}
            popoverOpeningHandler={popoverOpeningHandlerFile}
          />
        )}
      </Box>
    </>
  );
};

export default ContactCard;
