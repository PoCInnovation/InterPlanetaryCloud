# InterPlanetaryCloud

InterPlanetaryCloud (IPC) is a distributed cloud built on top of [Aleph](https://aleph.im/#/), the next generation network of distributed big data applications.

<div>
  <img src=".github/assets/landing-page.png" style="width: 80%;" alt="ipc-landing-page" />
</div>

IPC offers two services:

***Cloud Storage***

A distributed personal file storage and management system platform, protecting your data.

<br>

***Cloud Computing***

A distributed personal cloud computing platform for HTTP servers.

## Getting started 🔧

### Installation

#### Install Docker

Follow this [official guide](https://docs.docker.com/get-docker/) to install Docker, and [this one](https://docs.docker.com/compose/install/) to install Docker compose.\
If you want to play a little bit with Docker, you can follow this [tutorial](https://docker-curriculum.com) or even our [workshop](https://github.com/PoCInnovation/Workshops/tree/master/software/04.Docker)!

#### Install IPC

```sh
# Get the project
git clone git@github.com:PoCInnovation/InterPlanetaryCloud.git
cd InterPlanetaryCloud

# Build IPC docker image
docker compose build
```

### Quickstart

#### Run IPC 🚀

```sh
# Run IPC docker image
docker compose up
```

You are now ready to access to your decentralized cloud at [`http://localhost:3000`](http://localhost:3000) 💥

## Features 💫

### Cloud Storage

<img src=".github/assets/ipc-storage.png" style="width: 80%;" alt="ipc-drive" />

<details>
  <summary>Upload and use files</summary>
    <ul>
        <li>Once files are uploaded on IPC, they are not immutable!</li>
        <li>You can rename, modify the content or remove them as you want!</li>
    </ul>
</details>

<details>
  <summary>Create folders to organize your drive</summary>
    <ul>
        <li>Files are great, but virtual folders are also available on IPC to let you organize your files the way you want 🤩</li>
    </ul>
</details>

<details>
  <summary>Share your files (with access control)</summary>
    <ul>
        <li>Files can be shared among contacts with viewer or editor permissions, allowing for collaboration on your drive 🚀</li>
    </ul>
</details>

<details>
  <summary>Delete your files</summary>
    <ul>
        <li>Files can be put in the trash, and then deleted permanently :wastebasket:</li>
    </ul>
</details>

### Cloud Computing
<img src=".github/assets/ipc-computing.png" style="width: 80%;" alt="ipc-deploy-from-github" />

<details>
  <summary>Upload and execute simple programs</summary>
    <ul>
        <li>
            Using Aleph VMs, programs listening on port <code>8080</code> can be executed if their source code has a size under 1 MB.<br>
            Large files should be attached in a secondary volume, which is not a feature implemented on our side... yet 😉
        </li>
        <li>
            The VMs support binary executables, shell scrips, NodeJS and Python ASGI programs.<br>
            For further information, here is the <a href="https://github.com/aleph-im/aleph-vm/blob/main/tutorials/README.md">official aleph documentation</a>.
        </li>
    </ul>
</details>

<details>
  <summary>Import programs from GitHub</summary>
    <ul>
        <li>Uploading programs compressed in an archive is great, but importing it directly from GitHub is way better 🚀</li>
        <li>
            GitHub OAuth was implemented in IPC to import public and private repositories.<br>
            ⚠️ This feature is only available when running IPC locally as it's using the filesystem to clone and zip the repository content ⚠️
        </li>
    </ul>
</details>
  

## How does it work? 🤔

### Technologies 🧑‍💻

- [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- [React](https://reactjs.org/docs/getting-started.html) and [NextJS](https://nextjs.org/)
- [Chakra UI](https://chakra-ui.com)

### Security 🛡️

Every file that you upload will be encrypted thanks to [crypto-js](https://www.npmjs.com/package/crypto-js) and the encryption method of aleph from [eciesjs](https://www.npmjs.com/package/eciesjs).

### Database 📁

We use [Aleph SDK TS](https://github.com/aleph-im/aleph-sdk-ts#readme).

## Get involved

You're invited to join this project! Check out the [contributing guide](./CONTRIBUTING.md).

If you're interested in how the project is organized at a higher level, please contact the current project manager.


## Our PoC team 👌

### April 2023 - September 2023
Developers:
| [<img src="https://github.com/charlesmadjeri.png?size=85" width=85><br><sub>Charles Madjeri</sub>](https://github.com/charlesmadjeri) | [<img src="https://github.com/abdlastreet.png?size=85" width=85><br><sub>Abdallah Hammad</sub>](https://github.com/abdlastreet) | [<img src="https://github.com/molaryy.png?size=85" width=85><br><sub>Mohammed Jbilou</sub>](https://github.com/molaryy) | [<img src="https://github.com/sephorah.png?size=85" width=85><br><sub>Séphorah Aniambossou</sub>](https://github.com/sephorah)
|:---:|:---:|:---:|:---:|

Project Manager:

| [<img src="https://github.com/RezaRahemtola.png?size=85" width=85><br><sub>Reza Rahemtola</sub>](https://github.com/RezaRahemtola) |
|:---:|

### September 2022 - April 2023
Developers:

| [<img src="https://github.com/EdenComp.png?size=85" width=85><br><sub>Florian Lauch</sub>](https://github.com/EdenComp) | [<img src="https://github.com/lucas-louis.png?size=85" width=85><br><sub>Lucas Louis</sub>](https://github.com/lucas-louis) | [<img src="https://github.com/SloWayyy.png?size=85" width=85><br><sub>Mehdi Djendar</sub>](https://github.com/SloWayyy) |
|:---:|:---:|:---:|

Project Manager:

| [<img src="https://github.com/RezaRahemtola.png?size=85" width=85><br><sub>Reza Rahemtola</sub>](https://github.com/RezaRahemtola) |
|:---:|

### April 2022 - September 2022
Developers - Team Storage:

| [<img src="https://github.com/RezaRahemtola.png?size=85" width=85><br><sub>Reza Rahemtola</sub>](https://github.com/RezaRahemtola) | [<img src="https://github.com/TristanMasselot.png?size=85" width=85><br><sub>Tristan Masselot</sub>](https://github.com/TristanMasselot) | [<img src="https://github.com/Samoten777.png?size=85" width=85><br><sub>Laure Gagner</sub>](https://github.com/Samoten777) |
|:---:|:---:|:---:|

Developers - Team Computing:

| [<img src="https://github.com/AmozPay.png?size=85" width=85><br><sub>Amoz Pay</sub>](https://github.com/AmozPay) | [<img src="https://github.com/ZerLock.png?size=85" width=85><br><sub>Léo Dubosclard</sub>](https://github.com/ZerLock) | [<img src="https://github.com/Alex-Prevot.png?size=85" width=85><br><sub>Alex Prevot</sub>](https://github.com/Alex-Prevot) |
|:---:|:---:|:---:|

Project Manager:

| [<img src="https://github.com/adrienfort.png?size=85" width=85><br><sub>Adrien Fort</sub>](https://github.com/adrienfort) |
|:---:|

Reviewers:

| [<img src="https://github.com/lucas-louis.png?size=85" width=85><br><sub>Lucas Louis</sub>](https://github.com/lucas-louis) |
|:---:|

### September 2021 - April 2022
Developers:

| [<img src="https://github.com/lucas-louis.png?size=85" width=85><br><sub>Lucas Louis</sub>](https://github.com/lucas-louis) | [<img src="https://github.com/0xtekgrinder.png?size=85" width=85><br><sub>Matéo Viel</sub>](https://github.com/0xtekgrinder) |
|:---:|:---:|

Project Managers:

| [<img src="https://github.com/adrienfort.png?size=85" width=85><br><sub>Adrien Fort</sub>](https://github.com/adrienfort) |
|:---:|

### March 2021 - September 2021
Developers:

| [<img src="https://github.com/adrienfort.png?size=85" width=85><br><sub>Adrien Fort</sub>](https://github.com/adrienfort) | [<img src="https://github.com/rojas-diego.png?size=85" width=85><br><sub>Diego Rojas</sub>](https://github.com/rojas-diego) | [<img src="https://github.com/MrZalTy.png?size=85" width=85><br><sub>Lorenzo Carneli</sub>](https://github.com/MrZalTy) |
|:---:|:---:|:---:|

Project Managers:

| [<img src="https://github.com/lambdina.png?size=85" width=85><br><sub>Adina Cazalens</sub>](https://github.com/lambdina) | [<img src="https://github.com/0xpanoramix.png?size=85" width=85><br><sub>Luca Georges Francois</sub>](https://github.com/0xpanoramix) |
|:---:|:---:|

Reviewers:

| [<img src="https://github.com/TomChv.png?size=85" width=85><br><sub>Tom Chauveau</sub>](https://github.com/TomChv) |
|:---:|

<h2 align=center>
Organization
</h2>

<p align=center>
    <a href="https://www.linkedin.com/company/pocinnovation/mycompany/">
        <img src="https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white" alt="poc-linkedin-badge">
    </a>
    <a href="https://www.instagram.com/pocinnovation/">
        <img src="https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white" alt="poc-instagram-badge">
    </a>
    <a href="https://twitter.com/PoCInnovation">
        <img src="https://img.shields.io/badge/Twitter-1DA1F2?style=for-the-badge&logo=twitter&logoColor=white" alt="poc-twitter-badge">
    </a>
    <a href="https://discord.com/invite/Yqq2ADGDS7">
        <img src="https://img.shields.io/badge/Discord-7289DA?style=for-the-badge&logo=discord&logoColor=white" alt="poc-discord-badge">
    </a>
</p>
<p align=center>
    <a href="https://www.poc-innovation.fr/">
        <img src="https://img.shields.io/badge/WebSite-1a2b6d?style=for-the-badge&logo=GitHub Sponsors&logoColor=white" alt="poc-website-badge">
    </a>
</p>

> 🚀 Don't hesitate to follow us on our different networks, and put a star 🌟 on `PoC's` repositories
