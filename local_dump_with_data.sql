-- SQLite dump (schema + data)
-- Source DB: /mnt/data/local.db
-- Generated: 2026-02-03T20:48:44.854955Z

PRAGMA foreign_keys=OFF;
BEGIN TRANSACTION;
CREATE TABLE `combos` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`items` text,
	`image` text,
	`highlighted` integer DEFAULT false
);
INSERT INTO "combos" VALUES('c1','Combo Familiar','1 Pollo + 1 Pizza + Coca 1.5L',18000,'Pollo, Pizza, Coca','/images/combo1.jpg',1);
INSERT INTO "combos" VALUES('c2','Parrillada x2','Asado, Vacio, Chori, Morci',22000,'Asado, Vacio','/images/Combo2.jpg',1);
INSERT INTO "combos" VALUES('c3','Sandwich Mila Pack','2 Sandwiches + Papas',18000,'2 Sanguches, Papas','/images/Combo3.jpg',1);
INSERT INTO "combos" VALUES('c4','Super Picada','Fiambres varios y queso',15000,'Salame, Queso, Pan','/images/combo4.jpg',1);
CREATE TABLE `config` (
	`key` text PRIMARY KEY NOT NULL,
	`value` text
);
INSERT INTO "config" VALUES('whatsapp','+543704054127');
INSERT INTO "config" VALUES('horario','Mar a Dom 20:00 - 01:00');
INSERT INTO "config" VALUES('envio_base','10000');
CREATE TABLE `order_items` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`order_id` text,
	`product_name` text NOT NULL,
	`quantity` integer NOT NULL,
	`price` integer NOT NULL,
	FOREIGN KEY (`order_id`) REFERENCES `orders`(`id`) ON UPDATE no action ON DELETE no action
);
INSERT INTO "order_items" VALUES(1,'1770144337','Combo Familiar',1,18000);
INSERT INTO "order_items" VALUES(2,'1770145185','Combo Familiar',1,18000);
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`date` text NOT NULL,
	`customer_name` text NOT NULL,
	`customer_phone` text NOT NULL,
	`delivery_method` text NOT NULL,
	`delivery_address` text,
	`payment_method` text NOT NULL,
	`total` integer NOT NULL,
	`status` text DEFAULT 'Nuevo',
	`comments` text,
	`items_display` text
);
INSERT INTO "orders" VALUES('1770144337','2026-02-03T18:45:37.223Z','Oky','+543704054127','retiro','','efectivo',18000,'Nuevo','','1x Combo Familiar');
INSERT INTO "orders" VALUES('1770145185','2026-02-03T18:59:45.137Z','oky','+543704054127','retiro','','efectivo',18000,'Nuevo','ccc','1x Combo Familiar');
CREATE TABLE `products` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`price` integer NOT NULL,
	`category` text NOT NULL,
	`image` text,
	`available` integer DEFAULT true,
	`sort_order` integer DEFAULT 99
);
INSERT INTO "products" VALUES(1,'Pollo al Spiedo','Con papas fritas abundantes',12023,'Pollo','https://drive.google.com/file/d/1-Hb5W5P1anWxhSaAIUgreCxgEJ9fGPg5/view?usp=drive_link',1,1);
INSERT INTO "products" VALUES(2,'Canelones de Verdura','Salsa mixta, porcion abundante',8500,'Pastas','https://drive.google.com/file/d/1A1w0p0cMCeemTtwQEY7JDuFD5rBp9-RV/view?usp=drive_link',1,2);
INSERT INTO "products" VALUES(3,'Empanada Carne','Frita cortada a cuchillo',1500,'Empanadas','/images/empanada.jpg',1,3);
INSERT INTO "products" VALUES(4,'Pizza Muzzarella','Grande 8 porciones',8000,'Pizzas','https://drive.google.com/file/d/13sCwg58a2lwcA0_Wu4EEI_teA7svc7fY/view?usp=drive_link',1,4);
INSERT INTO "products" VALUES(5,'Hamburguesa Clásica','Jamón, Queso, Lechuga, Tomate, Mayonesa, Ketchup.
Aderezos a elección',4000,'Parrilla','https://drive.google.com/file/d/1iRGAmFEMZor-8dpGbnk8anvPJSpxPaiC/view?usp=drive_link',1,1);
INSERT INTO "products" VALUES(6,'Pollo al Spiedo','Con papas fritas abundantes y sopa py',12500,'Pollo','https://drive.google.com/file/d/1-Hb5W5P1anWxhSaAIUgreCxgEJ9fGPg5/view',1,1);
INSERT INTO "products" VALUES(7,'Canelones de Espinaca','Salsa, porcion abundante',8500,'Pastas','https://drive.google.com/file/d/1UlgLF1MTxhNwU3NTTEh42_f7zyF_Hyq0/view?usp=drive_link',1,2);
INSERT INTO "products" VALUES(8,'Empanada Jamón y Queso','jamón y queso de primera calidad',15000,'Empanadas','/images/empanada.jpg',1,3);
INSERT INTO "products" VALUES(9,'Pizza Calabresa','Grande 8 porciones',8000,'Pizzas','https://drive.google.com/file/d/1tClMMGHRVlVbV8aPPEIaOyxjA_Z4gHjo/view?usp=drive_link',1,4);
INSERT INTO "products" VALUES(10,'Sandwich de Bondiola','Aderezos a elección:
Mayonesa, Ketchup, Salsa criolla y chimichurri',14000,'Parrilla','https://drive.google.com/file/d/1JNOtWHs6eeOT2F2FdH2XfI5zC2IN3e7h/view?usp=drive_link',1,5);
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES('products',10);
INSERT INTO "sqlite_sequence" VALUES('order_items',2);
COMMIT;
PRAGMA foreign_keys=ON;
