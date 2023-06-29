import {
	Box,
	Button,
	HStack,
	Text,
	useColorMode,
	useColorModeValue,
	useToast,
	VStack,
	Wrap,
	WrapItem,
} from '@chakra-ui/react';
import {useState} from 'react';

import Card from 'components/Models/cards/Card';

import {useConfigContext} from 'contexts/config';
import {useUserContext} from 'contexts/user';

import {textColorMode} from 'config/colorMode';
import ConfigInputModal from './ConfigInputModal';
import ConfigSelect from './ConfigSelect';

const ConfigCard = (): JSX.Element => {
  const {user} = useUserContext();
  const {setConfig} = useConfigContext();
  const toast = useToast();
  const textColor = useColorModeValue(textColorMode.light, textColorMode.dark);

  const {toggleColorMode} = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  const [modalType, setModalType] = useState<string | undefined>(undefined);

  const changeConfig = async (key: string, value: string) => {
    setIsLoading(true);
    try {
      const config1 = await user.fullContact.manage.updateConfig(key, value);
      setConfig({
        ...user.config,
        [key]: {
          ...user.config[key],
          value,
        },
      });
      if (key === 'theme') {
        toggleColorMode();
      }
      setModalType(undefined);
      toast({title: config1.message, status: config1.success ? 'success' : 'error'});
    } catch (error) {
      toast({title: `Failed to change ${key}`, status: 'error'});
      console.error(error);
    }
    setIsLoading(false);
  };

  return (
    <>
      <ConfigInputModal
        isOpen={modalType !== undefined}
        type={modalType ?? ''}
        isLoading={isLoading}
        onClose={() => setModalType(undefined)}
        onClick={changeConfig}
      />
      <Wrap>
        <WrapItem>
          <Card size="md">
            <VStack align="start" spacing="64px">
              <VStack spacing="32px" align="start">
                <HStack spacing="16px">
                  <Text color={textColor} size="xl">
                    Configuration
                  </Text>
                </HStack>

                {Object.keys(user.config).map((key) => {
                  if (user.config[key].type === 'select')
                    return (
                      <ConfigSelect key={`${key}-select`} option={key} isLoading={isLoading} onClick={changeConfig}/>
                    );
                  return (
                    <HStack key={`${key}-input`} spacing="32px">
                      <Text color={textColor}>
                        <Box as="span" fontWeight="500">
                          {`${user.config[key].name}:`}
                        </Box>{' '}
                        {user.config[key].value}
                      </Text>
                      <Button
                        variant="secondary"
                        size="md"
                        cursor="pointer"
                        onClick={() => {
                          setModalType(key);
                        }}
                      >
                        Edit
                      </Button>
                    </HStack>
                  );
                })}
              </VStack>
            </VStack>
          </Card>
        </WrapItem>
      </Wrap>
    </>
  );
};

export default ConfigCard;
