# InterPlanetaryCloud

InterPlanetaryCloud (IPC) is a distributed cloud built on top of [Aleph](https://aleph.im/#/), the next generation network of distributed big data applications.

IPC offers two services :

***Cloud Storage***

A distributed personal file storage and management system plateform, protecting your data.

<div align="center">
  <img src=".github/assets/ipc.gif" width="80%" />
 </div>

***Cloud Computing***

A distributed personal cloud computing plateform for HTTP servers.

## Getting started :wrench:

### Installation

#### Install Docker

Follow this [official guide](https://docs.docker.com/get-docker/) to install Docker.\
If you want to play a little bit with Docker, you can follow this [tutorial](https://docker-curriculum.com) or even our [workshop](https://github.com/PoCInnovation/Workshops/tree/master/software/04.Docker) !

#### Install IPC

```
# Get the project
git clone git@github.com:PoCInnovation/InterPlanetaryCloud.git
cd InterPlanetaryCloud

# Build IPC docker image
docker build . -t ipc:latest
```

### Quickstart

#### Run IPC :rocket:

```
# Run IPC docker image
docker run -p 8080:80 ipc:latest
```

You are now ready to access to your decentralized cloud at [`http://localhost:8080`](http://localhost:8080) :boom: !

## Get involved

You're invited to join this project ! Check out the [contributing guide](./CONTRIBUTING.md).

If you're interested in how the project is organized at a higher level, please contact the current project manager.

## Features :dizzy:

<details>
  <summary>Home Page</summary>

 ![Home Page](.github/assets/home.png)

</details>

<details>
  <summary>Signup Page</summary>

 ![Signup Page](.github/assets/signup.png)

</details>

<details>
  <summary>Signup Page - Mnemonics given</summary>

 ![Signup Page Mnemonics](.github/assets/signupMnemonics.png)

</details>

<details>
  <summary>Login Page</summary>

 ![Login Page](.github/assets/login.png)

</details>

<details>
  <summary>Dashboard</summary>

 ![Dashboard](.github/assets/ipc-dashboard.png)

</details>

<details>
  <summary>Dashboard - Upload a file</summary>

 ![Dashboard Upload](.github/assets/ipc-dashboard-upload-a-file.png)

</details>

<details>
  <summary>Dashboard - Share a file</summary>

![Dashboard Upload](.github/assets/ipc-dashboard-share-a-file.png)

</details>

<details>
  <summary>Dashboard - Files shared</summary>

![Dashboard Upload](.github/assets/ipc-dashboard-files-shared.png)

</details>

<details>
  <summary>Dashboard - Contacts</summary>

![Dashboard Upload](.github/assets/ipc-dashboard-contacts.png)

</details>

<details>
  <summary>Dashboard - Add a contact</summary>

![Dashboard Upload](.github/assets/ipc-dashboard-add-a-contact.png)

</details>

<details>
  <summary>Dashboard - Update a contact</summary>

![Dashboard Upload](.github/assets/ipc-dashboard-update-a-contact.png)

</details>

<details>
  <summary>Dashboard - User's profile</summary>

![Dashboard Upload](.github/assets/ipc-dashboard-my-profile.png)

</details>

## How does it work? :thinking:

### Technologies 🧑‍💻

- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [React](https://reactjs.org/docs/getting-started.html)
- [Chakra UI](https://chakra-ui.com)

### Security 🛡️

Every file that you upload will be encrypted thanks to [crypto-js](https://www.npmjs.com/package/crypto-js).

### Database :file_folder:

We use [Aleph SDK TS](https://github.com/aleph-im/aleph-sdk-ts#readme).

<details>
  <summary>Full overview</summary>

  <img src=".github/assets/ipc-graph.png" width="85%" />
</details>

---

- For each file, a random key is generated and the content of the file is encrypted with this key.
- The content is pushed into a store message via the aleph network.
- The hash of the store message and the key are added to the 'Contacts' post message.

<details>
    <summary>Upload a file</summary>

<img src=".github/assets/ipc-upload-a-file.png" width="50%" />

</details>

---

- For each contacts into the 'Post Message - Contacts', the files and contacts are get.
- An occurrence between the address of the user and the contacts is searched.
- For each file found, metadata about the files are retrieved.

<details>
    <summary>Load a file</summary>

<img src=".github/assets/ipc-file-loading.png" width="50%" />

</details>

---

- The content is retrieved from the aleph network from his hash.
- The content is decrypted with the key, itself decrypted with the private key of the user.

<details>
    <summary>Download a file</summary>

<img src=".github/assets/ipc-download-a-file.png" width="50%" />

</details>

---

- The hash and the key are encrypted with the public key of the contact.
- These infos are added to the list of shared files of the contact.

<details>
    <summary>Share a file</summary>

<img src=".github/assets/ipc-share-a-file.png" width="50%" />

</details>

---

- One post message, with the list of contacts and the list of shared files for each contacts
- The post message contains the info about the contact, his name, address, public key and a list of shared files

<details>
    <summary>Post messages</summary>

<div>
<img src=".github/assets/ipc-post-message.png" width="50%" />
</div>

</details>

## Our PoC team :ok_hand:

### April 2022 - September 2022
Developpers - Team Storage:

| [<img src="https://github.com/RezaRahemtola.png?size=85" width=85><br><sub>Reza Rahemtola</sub>](https://github.com/RezaRahemtola) | [<img src="https://github.com/TristanMasselot.png?size=85" width=85><br><sub>Tristan Masselot</sub>](https://github.com/TristanMasselot) | [<img src="https://github.com/Samoten777.png?size=85" width=85><br><sub>Samoten 777</sub>](https://github.com/Samoten777)
|:---:|:---:|:---:|

Developpers - Team Computing:

| [<img src="https://github.com/AmozPay.png?size=85" width=85><br><sub>Amoz Pay</sub>](https://github.com/AmozPay)| [<img src="https://github.com/ZerLock.png?size=85" width=85><br><sub>Léo Dubosclard</sub>](https://github.com/ZerLock) | [<img src="https://github.com/Alex-Prevot.png?size=85" width=85><br><sub>Alex Prevot</sub>](https://github.com/Alex-Prevot)
|:---:|:---:|:---:|

Project Manager:
| [<img src="https://github.com/adrienfort.png?size=85" width=85><br><sub>Adrien Fort</sub>](https://github.com/adrienfort)
| :---: |

Reviewers :
| [<img src="https://github.com/lucas-louis.png?size=85" width=85><br><sub>Lucas Louis</sub>](https://github.com/lucas-louis)
| :---: |

### September 2021 - April 2022
Developers:
| [<img src="https://github.com/lucas-louis.png?size=85" width=85><br><sub>Lucas Louis</sub>](https://github.com/lucas-louis) | [<img src="https://github.com/lolboysg.png?size=85" width=85><br><sub>Matéo Viel</sub>](https://github.com/lolboysg)
| :---: | :---: |

Project Managers:
| [<img src="https://github.com/adrienfort.png?size=85" width=85><br><sub>Adrien Fort</sub>](https://github.com/adrienfort)
| :---: |

### March 2021 - September 2021
Developers:
| [<img src="https://github.com/adrienfort.png?size=85" width=85><br><sub>Adrien Fort</sub>](https://github.com/adrienfort) | [<img src="https://github.com/rojasdiegopro.png?size=85" width=85><br><sub>Diego Rojas</sub>](https://github.com/rojasdiegopro) | [<img src="https://github.com/MrZalTy.png?size=85" width=85><br><sub>Lorenzo Carneli</sub>](https://github.com/MrZalTy)
| :---: | :---: | :---: |

Project Managers:
| [<img src="https://github.com/NaadiQmmr.png?size=85" width=85><br><sub>Adina Cazalens</sub>](https://github.com/NaadiQmmr) | [<img src="https://github.com/PtitLuca.png?size=85" width=85><br><sub>Luca Georges Francois</sub>](https://github.com/PtitLuca)
| :---: | :---: |

Reviewers :
| [<img src="https://github.com/TomChv.png?size=85" width=85><br><sub>Tom Chauveau</sub>](https://github.com/TomChv)
| :---: |

<h2 align=center>
Organization
</h2>

<p align='center'>
    <a href="https://www.linkedin.com/company/pocinnovation/mycompany/">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white">
    </a>
    <a href="https://www.instagram.com/pocinnovation/">
        <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white">
    </a>
    <a href="https://twitter.com/PoCInnovation">
        <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white">
    </a>
    <a href="https://discord.com/invite/Yqq2ADGDS7">
        <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white">
    </a>
</p>
<p align=center>
    <a href="https://www.poc-innovation.fr/">
        <img src="https://img.shields.io/badge/WebSite-1a2b6d?style=for-the-badge&logo=GitHub Sponsors&logoColor=white">
    </a>
</p>

> :rocket: Don't hesitate to follow us on our different networks, and put a star 🌟 on `PoC's` repositories
