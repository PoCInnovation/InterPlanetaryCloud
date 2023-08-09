import {accounts} from 'aleph-sdk-ts';
import {aggregate} from 'aleph-sdk-ts/dist/messages';
import {ALEPH_CHANNEL} from 'config/constants';
import {ItemType} from 'aleph-sdk-ts/dist/messages/types';

import User from 'lib/user';

import {AggregateType, IPCConfig} from 'types/types';

type AuthReturnType = {
    user: User | undefined;
    message: string;
};

class Auth {
    private defaultConfig: IPCConfig = {
        theme: {
            name: 'theme',
            type: 'select',
            options: ['light', 'dark'],
            value: 'light',
        },
        defaultName: {
            name: 'default name',
            type: 'input',
            value: '[userName]@[repositoryName]',
        },
        defaultEntrypoint: {
            name: 'default entrypoint',
            type: 'input',
            value: 'main:app',
        },
    };

    public async logout(): Promise<void> {
        localStorage.clear();
    }

    public async signup(): Promise<AuthReturnType & { mnemonic?: string }> {
        try {
            const {mnemonic, account} = accounts.ethereum.NewAccount();

            const user = new User(account, this.defaultConfig);

            await this.createAggregate(account);

            return {user, mnemonic, message: 'Your account has been created successfully.'};
        } catch (err) {
            console.error(err);
            return {user: undefined, mnemonic: undefined, message: 'An error occurred while creating your account.'};
        }
    }

    public async loginWithCredentials(mnemonic: string, importedConfig: IPCConfig): Promise<AuthReturnType> {
        try {
            if (!mnemonic) return {user: undefined, message: 'Your mnemonic is required to login.'};
            const importedAccount = accounts.ethereum.ImportAccountFromMnemonic(mnemonic);
            const user = new User(importedAccount, importedConfig);

            await this.createAggregate(importedAccount);

            return {user, message: 'You have been logged in successfully.'};
        } catch (err) {
            console.error(err);
            return {user: undefined, message: 'An error occurred while logging to your account.'};
        }
    }

    public async loginWithProvider(importedConfig: IPCConfig): Promise<AuthReturnType> {
        try {
            const account = await accounts.ethereum.GetAccountFromProvider(window.ethereum);
            const user = new User(account, importedConfig);

            await this.createAggregate(account);

            return {user, message: 'You have been logged in successfully.'};
        } catch (err) {
            console.error(err);
            return {user: undefined, message: 'An error occurred while logging to your account.'};
        }
    }

    private async createAggregate(account: accounts.ethereum.ETHAccount): Promise<void> {
        try {
            await aggregate.Get<AggregateType>({
                address: account.address,
                keys: ['InterPlanetaryCloud'],
            });
        } catch (error) {
            console.error(error);
            aggregate.Publish({
                channel: ALEPH_CHANNEL,
                storageEngine: ItemType.ipfs,
                account,
                key: 'InterPlanetaryCloud',
                content: {
                    contacts: [
                        {
                            name: 'Owner (Me)',
                            address: account.address,
                            publicKey: account.publicKey,
                            files: [],
                            folders: [],
                            config: this.defaultConfig,
                        },
                    ],
                    programs: [],
                },
            });
        }
    }
}

export type {AuthReturnType};
export default Auth;
