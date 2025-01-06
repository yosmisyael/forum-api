<br />
<h3 align="center">Forum API</h3>
<div align="center">
<p align="center">
RESTful API for forum application as a submission to the Dicoding course "Menjadi Back-End Developer Expert dengan JavaScript".
    <br />
</p>
</div>

<details id="readme-top">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#built-with">Built With</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

## About the Project
### Built With
![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) ![GitHub Actions](https://img.shields.io/badge/github%20actions-%232671E5.svg?style=for-the-badge&logo=githubactions&logoColor=white) ![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white) ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) ![Jest](https://img.shields.io/badge/-jest-%23C21325?style=for-the-badge&logo=jest&logoColor=white) ![ESLint](https://img.shields.io/badge/ESLint-4B3263?style=for-the-badge&logo=eslint&logoColor=white)

<p align="right">(<a href="#readme-top">back to top</a>)</p>

## Getting Started
### Installation

1. Clone the repo
   ```sh
   https://github.com/yosmisyael/forum-api.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Setup `.env` files for production or `.env.test` for testing

   | KEY        | REQUIRED | DESCRIPTION           |
   |:-----------|:--------:|:----------------------|
   | PGHOST     |   true   | Database hostname     |
   | PGPORT     |   true   | Database port         |
   | PGUSER     |   true   | Database username     |
   | PGPASSWORD |   true   | Database password     |
   | PGDATABASE |   true   | Database name         |
   | HOST       |   true   | Server hostname       |
   | PORT        |   true   | Application port      |
   | ACCESS_TOKEN_KEY        |   true   | JWT access token key  |
   | REFRESH_TOKEN_KEY        |   true   | JWT refresh token key |
   | ACCCESS_TOKEN_AGE        |   true   | JWT token age         |
4. Run the application
   ```sh
   # run unit testing
   npm run test
   # run the application
   npm run start  
   ```

<p align="right">(<a href="#readme-top">back to top</a>)</p>

<!-- LICENSE -->
## License

Distributed under the GNU GPLv3. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>