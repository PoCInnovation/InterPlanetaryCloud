import {
	Box,
	Button,
	HStack,
	Icon,
	Input,
	Text,
	Tooltip,
	useColorModeValue,
	useToast,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import Avatar from 'boring-avatars';
import {ChangeEvent, useState} from 'react';
import {BsClipboard} from 'react-icons/bs';
import Card from 'components/Models/cards/Card';

import {useUserContext} from 'contexts/user';

import {textColorMode} from 'config/colorMode';

import colors from 'theme/foundations/colors';

import Modal from '../Models/Modal';

const AccountCard = (): JSX.Element => {
  const {user} = useUserContext();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState<string>(user.fullContact.contact.username || '');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const toast = useToast({duration: 2000, isClosable: true});

  const changeName = async () => {
    setIsLoading(true);
    try {
      const config1 = await user.fullContact.manage.update(user.account.address, input);
      setIsOpen(false);
      toast({title: config1.message, status: config1.success ? 'success' : 'error'});
    } catch (error) {
      toast({title: 'Failed to change name', status: 'error'});
      console.error(error);
    }
    setIsLoading(false);
  };

  const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title={'Configuration modfication'}
        CTA={
          <Button
            variant="secondary"
            size="lg"
            onClick={changeName}
            isLoading={isLoading}
            disabled={input === ''}
            cursor={input === '' ? 'not-allowed' : 'pointer'}
            id="ipc-config-modal-button"
          >
            Change my name
          </Button>
        }
      >
        <VStack spacing="16px" w="100%" align="start">
          <Input value={input} onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}/>
        </VStack>
      </Modal>
      <Wrap>
        <WrapItem>
          <Card size="md">
            <VStack align="start" spacing="64px">
              <VStack spacing="32px" align="start">
                <HStack spacing="16px">
                  <Avatar
                    size="32"
                    name={user.account.address}
                    variant="marble"
                    colors={[
                      colors.red['1000'],
                      colors.blue['1100'],
                      colors.red['500'],
                      colors.gray['100'],
                      colors.blue['500'],
                    ]}
                  />
                  <Text color={textColor} size="xl">
                    {user.fullContact.contact.username}
                  </Text>
                </HStack>
                <HStack spacing="16px">
                  <Button variant="secondary" size="md" cursor="pointer" onClick={() => setIsOpen(true)}>
                    Change my name
                  </Button>
                  <Tooltip label="Coming soon..." hasArrow>
                    <Button variant="secondary" size="md" cursor="not-allowed">
                      Change my avatar
                    </Button>
                  </Tooltip>
                </HStack>
              </VStack>
              <VStack spacing="16px" align="start">
                <HStack>
                  <Text color={textColor}>
                    <Box as="span" fontWeight="500">
                      My address:
                    </Box>{' '}
                    {user.account.address}
                  </Text>
                  <Icon
                    as={BsClipboard}
                    w="16px"
                    h="16px"
                    cursor="pointer"
                    onClick={() => navigator.clipboard.writeText(user.account.address || '')}
                  />
                </HStack>
                <HStack>
                  <Text color={textColor} maxW="450px" overflow="hidden" textOverflow="ellipsis" whiteSpace="nowrap">
                    <Box as="span" fontWeight="500">
                      My public key:
                    </Box>{' '}
                    {user.account.publicKey}
                  </Text>
                  <Icon
                    as={BsClipboard}
                    w="16px"
                    h="16px"
                    cursor="pointer"
                    onClick={() => navigator.clipboard.writeText(user.account.publicKey || '')}
                  />
                </HStack>
              </VStack>
            </VStack>
          </Card>
        </WrapItem>
      </Wrap>
    </>
  );
};

export default AccountCard;
