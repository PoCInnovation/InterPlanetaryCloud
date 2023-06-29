import {HStack} from '@chakra-ui/react';
import Button from 'components/Models/Button';
import {useConfigContext} from '../../contexts/config';

const ConfigInputModal = ({
                            option,
                            isLoading,
                            onClick,
                          }: {
  option: string;
  isLoading: boolean;
  onClick: (key: string, value: string) => Promise<void>;
}): JSX.Element => {
  const {config} = useConfigContext();
  const elem = config[option];

  if (elem.type !== 'select') return <></>;

  return (
    <HStack key={`${elem.name}-select`} spacing="16px">
      {elem.options.map((optionValue) => (
        <Button
          key={`${elem.name}-select-${optionValue}`}
          variant={elem.value === optionValue ? 'primary' : 'secondary'}
          disabled={elem.value === optionValue}
          isLoading={isLoading}
          onClick={() => {
            onClick('theme', optionValue);
          }}
          size="md"
        >
          {`${optionValue} ${elem.name}`}
        </Button>
      ))}
    </HStack>
  );
};

export default ConfigInputModal;
