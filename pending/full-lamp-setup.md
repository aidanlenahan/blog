# Ubuntu LAMP + phpMyAdmin Setup Guide

This guide walks through setting up a **LAMP stack** (Linux, Apache, MySQL, PHP) on Ubuntu, followed by **phpMyAdmin**.

It is written for a **local development or homelab server** using Apache and MySQL on the same machine.

---

## Part 1 — LAMP Stack Setup

### 1. Update the system

```bash
sudo apt update && sudo apt upgrade -y
```

---

### 2. Install Apache

```bash
sudo apt install apache2 -y
```

Verify Apache is running:

```bash
sudo systemctl status apache2
```

Test in a browser:

```
http://localhost
```

---

### 3. Install MySQL

```bash
sudo apt install mysql-server -y
```

Verify MySQL:

```bash
sudo systemctl status mysql
```

Log in as root (Ubuntu default uses socket auth):

```bash
sudo mysql
```

Exit:

```sql
EXIT;
```

---

### 4. Install PHP and required modules

```bash
sudo apt install php libapache2-mod-php php-mysql -y
```

Verify PHP:

```bash
php -v
```

---

### 5. (Optional) Fix Apache ServerName warning

Edit Apache config:

```bash
sudo nano /etc/apache2/apache2.conf
```

Add at the bottom:

```apache
ServerName localhost
```

Reload Apache:

```bash
sudo systemctl reload apache2
```

---

### 6. Test PHP with Apache

Create a test file:

```bash
sudo nano /var/www/html/info.php
```

```php
<?php phpinfo(); ?>
```

Visit:

```
http://localhost/info.php
```

Delete it afterward:

```bash
sudo rm /var/www/html/info.php
```

---

## Part 2 — phpMyAdmin (Primary / Automatic Setup)

### 1. Install phpMyAdmin

```bash
sudo apt install phpmyadmin -y
```

During installation:

* **Web server:** select `apache2` (use SPACE, then ENTER)
* **Configure database with dbconfig-common:** Yes
* **Connection method:** Unix socket
* **Authentication plugin:** default
* **Database name:** phpmyadmin
* **MySQL username:** phpmyadmin@localhost
* **Password:** enter a STRONG password

> MySQL enforces a STRONG password policy by default.

Password requirements:

* ≥ 8 characters
* uppercase + lowercase
* number
* special character

Example:

```
MyP@ssw0rd123!
```

---

### 2. Enable phpMyAdmin in Apache

If needed:

```bash
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
sudo systemctl reload apache2
```

---

### 3. Access phpMyAdmin

Open:

```
http://localhost/phpmyadmin
```

Log in using:

* **Username:** phpmyadmin (or another DB user you create)
* **Password:** the MySQL password for that user

---

## If phpMyAdmin Setup Fails (Manual Setup)

Use this section **only if** the installer fails due to MySQL password or authentication issues.

---

### 1. Remove broken phpMyAdmin install

```bash
sudo apt purge phpmyadmin -y
sudo apt autoremove -y
```

---

### 2. Reinstall phpMyAdmin without DB auto-setup

```bash
sudo apt install phpmyadmin
```

When prompted:

* **Configure database with dbconfig-common:** No

---

### 3. Manually create phpMyAdmin database and user

Log into MySQL:

```bash
sudo mysql
```

```sql
CREATE DATABASE phpmyadmin;

CREATE USER 'phpmyadmin'@'localhost'
IDENTIFIED WITH mysql_native_password
BY 'StrongP@ssw0rd123!';

GRANT ALL PRIVILEGES ON phpmyadmin.* TO 'phpmyadmin'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### 4. Import phpMyAdmin tables

```bash
sudo mysql -u phpmyadmin -p phpmyadmin < /usr/share/phpmyadmin/sql/create_tables.sql
```

---

### 5. Enable phpMyAdmin in Apache

```bash
sudo ln -s /usr/share/phpmyadmin /var/www/html/phpmyadmin
sudo systemctl reload apache2
```

---

### 6. Verify

Visit:

```
http://localhost/phpmyadmin
```

Login with:

* Username: phpmyadmin
* Password: the one you set

---

## Important Concepts (Read Once)

### MySQL root vs phpMyAdmin user

* **MySQL root**

  * Admin account
  * Uses socket authentication on Ubuntu
  * Accessed via `sudo mysql`

* **phpmyadmin user**

  * Regular MySQL user
  * Uses password authentication
  * Used by phpMyAdmin

They are **completely separate accounts**.

---

## Recommended Best Practice

* Keep MySQL root using socket auth
* Create separate users per project
* Do not expose phpMyAdmin publicly
* Restrict phpMyAdmin to localhost if possible

---

## Troubleshooting Commands

Check users and auth plugins:

```sql
SELECT user, host, plugin FROM mysql.user;
```

Check password policy:

```sql
SHOW VARIABLES LIKE 'validate_password%';
```

---

## Sources
[https://www.digitalocean.com/community/tutorials/how-to-install-lamp-stack-on-ubuntu](https://www.digitalocean.com/community/tutorials/how-to-install-lamp-stack-on-ubuntu)
