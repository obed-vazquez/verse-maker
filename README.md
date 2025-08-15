# VIRO & VALO Verse Maker
### 📜 English Description
This Google Apps Script is part of a Google Docs add-on called VerseMaker. Its purpose is to automatically detect Bible verse references within a document and turn them into clickable hyperlinks pointing to the corresponding passage on Bible.com.

The script uses a set of predefined regular expressions to recognize abbreviations and full names of Bible books in multiple languages (Spanish and English), followed by chapter and verse patterns. Once detected, it converts each reference into a hyperlink using either the Reina-Valera 1960 (Spanish, ID 149) or King James Version (English, ID 1), depending on the selected option in the custom menu.

The add-on integrates into Google Docs by adding a menu called "VerseMaker" with options to set hyperlinks in Spanish or English, as well as a help section. The code also contains utility functions for regex matching, URL building, user alerts, error handling, and exception reporting via email.

### 📜 Descripción en Español
Este script de Google Apps Script forma parte de un complemento para Google Docs llamado VerseMaker. Su función es detectar automáticamente referencias a versículos de la Biblia dentro de un documento y convertirlas en hipervínculos que apuntan al pasaje correspondiente en Bible.com.

El script utiliza un conjunto de expresiones regulares predefinidas para reconocer abreviaturas y nombres completos de libros de la Biblia en varios idiomas (español e inglés), seguidos del patrón de capítulo y versículo. Una vez detectadas, convierte cada referencia en un enlace, usando la versión Reina-Valera 1960 (español, ID 149) o King James Version (inglés, ID 1), según la opción seleccionada en el menú personalizado.

El complemento se integra en Google Docs añadiendo un menú llamado "VerseMaker" con opciones para establecer hipervínculos en español o en inglés, así como una sección de ayuda. El código también incluye funciones auxiliares para coincidencias con expresiones regulares, generación de URLs, alertas al usuario, manejo de errores y envío de reportes de excepciones por correo electrónico.

## 1) What is this repository for?

### 1.1) Quick summary

This requires Google infraestructure to be deployed.

### 1.2) Disclosure
_We hereby certify that, to the best of our knowledge,
neither we nor any individual or entity with whom or which I have a significant working
relationship have (has) received something of value from a commercial party related directly or
indirectly to the subject of this project._

## 2) How do I get set up? ###

### 2.1) Summary of set up
You will require access to the project tools and they are not listed or described in here.

## 4) What are the Contribution guidelines?

#### 4.1) Writing tests.

_No tests._

#### 4.2) Code review.

_Request if needed._

#### 4.3) Other guidelines.

_Please ask for the code standard to use as a guideline and reflect it in the project._

## 5) Who do I talk to?

<table>
<thead><tr><th><b>Role</b></th> <th><b>Contact</b></th></tr></thead>
<tr><td>Owner/admin</td><td><a href='mailto:obed.vazquez@gmail.com'>obed.vazquez@gmail.com</a></td></tr>
<tr><td>Owner/admin</td><td><a href='mailto:oscarvir123@gmail.com'>oscarvir123@gmail.com</a></td></tr>
<tr><td>Community</td><td> send us a message in <a href='https://discord.gg/qyvzfUgYxm'>our Discord Server</a></td></tr>
</table>

>Please, contact us if you want to help; In general, we are developing, maintaining, and supporting this project
on our own with no help or support from anyone; any tip, comment, change, or help in general is well-received.

