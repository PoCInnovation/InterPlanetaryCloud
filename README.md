# InterPlanetaryCloud
A personal file storage and management system built on top of [IPFS](https://ipfs.io/), protecting your data.

## Installation :wrench:

**1) Install Docker**  
Follow this [official guide](https://docs.docker.com/get-docker/) to install Docker.  
If you want to play a little bit with Docker, you can follow this [tutorial](https://docker-curriculum.com) or even our [workshop](https://github.com/PoCInnovation/Workshops/tree/master/software/04.Docker) !

**2) Install IPC**  
```
# Get the project
git clone git@github.com:PoCInnovation/InterPlanetaryCloud.git
cd InterPlanetaryCloud

# Build IPC docker image
docker build . -t ipc:latest
```

## Quickstart ⏩
**Run IPC :rocket:**  
```
# Run IPC docker image
docker run -p 3000:3000 ipc:latest
```
You are now ready to access to your decentralized cloud :boom: !

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
  <summary>Login Page</summary>
  
 ![Login Page](.github/assets/login.png)
 
</details>

<details>
  <summary>Dashboard</summary>
  
 ![Dashboard](.github/assets/dashboard.png)
 
</details>

## How ? :thinking:

**Technologies 🧑‍💻**
+ [React](https://reactjs.org/docs/getting-started.html)
+ [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)

**Database :file_folder:**  
We use [Aleph TS](https://github.com/PtitLuca/aleph-ts#readme).

**Security 🛡️**  
Your password is hashed with [bcrypt](https://www.npmjs.com/package/bcrypt).  
Every file that you upload will be encrypted thanks to [crypto-js](https://www.npmjs.com/package/crypto-js).

## Our [PoC](https://www.poc-innovation.fr/) team :ok_hand:
Developers:
+ [Adrien Fort](https://github.com/adrienfort)
+ [Diego Rojas](https://github.com/rojasdiegopro)
+ [Lorenzo Carneli](https://github.com/MrZalTy)

Project Managers:
+ [Adina Cazalens](https://github.com/NaadiQmmr)
+ [Luca Georges Francois](https://github.com/PtitLuca)

Thanks to [Tom Chauveau](https://github.com/TomChv) for contributing to this project by submitting his review to our code !
