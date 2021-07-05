# smk3-server
<!-- PROJECT SHIELDS -->
<!--
*** I'm using markdown "reference style" links for readability.
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![LinkedIn][linkedin-shield]][linkedin-url]



<!-- PROJECT LOGO -->
<br />
<p align="center">
  <a href="https://github.com/boardwallfloor/smk3-server">
    <img src="https://imgur.com/a/kdKdv0n" alt="SMK3" width="80" height="80">
  </a>

  <h3 align="center">SMK3 Server</h3>

  <p align="center">
    A server for SMK3 Client for creating and collectiong of SMK3 reports using MongoDB and Express
    <br />
<!--     <a href="https://github.com/othneildrew/Best-README-Template"><strong>Explore the docs »</strong></a> -->
    <br />
    <br />
<!--     <a href="https://github.com/othneildrew/Best-README-Template">View Demo</a> -->
    ·
<!--     <a href="https://github.com/othneildrew/Best-README-Template/issues">Report Bug</a> -->
    ·
<!--     <a href="https://github.com/othneildrew/Best-README-Template/issues">Request Feature</a> -->
  </p>
</p>



<!-- TABLE OF CONTENTS -->
<details open="open">
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
    <li><a href="#usage">Usage</a></li>
<!--     <li><a href="#roadmap">Roadmap</a></li> -->
<!--     <li><a href="#contributing">Contributing</a></li> -->
<!--     <li><a href="#license">License</a></li> -->
    <li><a href="#contact">Contact</a></li>
    <li><a href="#acknowledgements">Acknowledgements</a></li>
  </ol>
</details>



<!-- ABOUT THE PROJECT -->
## About The Project

<!-- [![Product Name Screen Shot][product-screenshot]](https://example.com) -->

SMK3 - Server is server part of a report creating and collecting of a web based SMK3 ( Sistem Manajemen Keselamatan dan Kesehatan Kerja), thus this server are meant to be used with <a href="https://github.com/boardwallfloor/smk3-client">SMK3 - Client</a>. However there's no reason for this to not be modified and used for other project and or be repurposed as a template.

Functionalities:
* Create, Read, Delete and Update Controllers
* Models 
* Sending Emails (using Mailtrap SMTP)
* Login and Authentication using JWT

Naturally, there's many thing this project lacked, however I intend to updated it as times goes on as my skill improve.

### Built With

This section should list any major frameworks that you built your project using. Leave any add-ons/plugins for the acknowledgements section. Here are a few examples.
* [NodeJS](https://nodejs.org/)
* [ExpressJS](https://expressjs.com/)
* [MongoDB](https://www.mongodb.com/)



<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* Code/Text Editor of your choice ex. Sublime, VS Code
* Node Js (You can get it from the official website [here](https://nodejs.org/)
* MongoDB account and cluster (Setup tutorial from Mozilla Wiki [here](https://developer.mozilla.org/en-US/docs/Learn/Server-side/Express_Nodejs/mongoose#setting_up_the_mongodb_database)
* API testing tools of your choice ex. Postman, SoapUI, Web Browser

### Installation

1. Set up a MongoDB account, and create a cluster
2. Clone the repo
   ```sh
   git clone git@github.com:boardwallfloor/smk3-server.git
   ```
3. Install NPM packages
   ```sh
   npm install
   ```
4. Configure enviroment in `.env`
   ```ENV
   DB_USER=mongoDB_username
   DB_PASS=mongoDB_password
   SS_SECRET=session_secret
   JWT_SECRET=jwt_secret
   ```



<!-- USAGE EXAMPLES -->
## Usage



<!-- _For more examples, please refer to the [Documentation](https://example.com)_ -->


<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.



<!-- CONTACT -->
## Contact
Faris Takhassuna Zamzani - [LinkdIn](https://www.linkedin.com/in/faris-t-05b348187) - takhassuna.fz@gmail.com

Project Link: [https://github.com/boardwallfloor/smk3-server](https://github.com/boardwallfloor/smk3-server)




<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/boardwallfloor/smk3-server.svg?style=for-the-badge
[contributors-url]: https://github.com/boardwallfloor/smk3-server/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/boardwallfloor/smk3-server.svg?style=for-the-badge
[forks-url]: https://github.com/othneildrew/smk3-server/network/members
[stars-shield]: https://img.shields.io/github/stars/boardwallfloor/smk3-server.svg?style=for-the-badge
[stars-url]: https://github.com/boardwallfloor/smk3-server/stargazers
[issues-shield]: https://img.shields.io/github/issues/boardwallfloor/smk3-server.svg?style=for-the-badge
[issues-url]: https://github.com/boardwallfloor/smk3-server/issues
[license-shield]: https://img.shields.io/github/license/othneildrew/smk3-server.svg?style=for-the-badge
[license-url]: https://github.com/boardwallfloor/smk3-server/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=for-the-badge&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/faris-t-05b348187
