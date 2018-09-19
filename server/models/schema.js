import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import db from './db';


dotenv.config();

const adminPassword = bcrypt.hashSync(process.env.ADMIN_PASS, 10);

const tableSchema = `
    DROP TABLE IF EXISTS users CASCADE;

    DROP TABLE IF EXISTS orders CASCADE;

    DROP TABLE IF EXISTS menu CASCADE;

    DROP TABLE IF EXISTS order_items;

    DROP TABLE IF EXISTS delivery_address;

    CREATE TABLE "users" (
        "user_id" serial NOT NULL,
        "first_name" TEXT,
        "last_name" TEXT,
        "email" TEXT NOT NULL UNIQUE,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL,
        CONSTRAINT users_pk PRIMARY KEY ("user_id")
    ) WITH (
    OIDS=FALSE
    );



    CREATE TABLE "orders" (
        "order_id" serial NOT NULL,
        "user_id" int NOT NULL,
        "status" TEXT NOT NULL,
        "date_created" TIMESTAMP NOT NULL,
        "last_updated" TIMESTAMP NOT NULL,
        "total_amount" int NOT NULL,
        CONSTRAINT orders_pk PRIMARY KEY ("order_id")
    ) WITH (
    OIDS=FALSE
    );



    CREATE TABLE "menu" (
        "food_id" serial NOT NULL,
        "no_of_times_ordered" int NOT NULL DEFAULT '0',
        "item_name" TEXT NOT NULL,
        "quantity" TEXT NOT NULL,
        "price" int NOT NULL,
        "image_url" TEXT NOT NULL,
        "category" TEXT NOT NULL,
        CONSTRAINT menu_pk PRIMARY KEY ("food_id")
    ) WITH (
    OIDS=FALSE
    );



    CREATE TABLE "order_items" (
        "order_id" int NOT NULL,
        "food_id" int NOT NULL,
        "quantity_ordered" int NOT NULL
    ) WITH (
    OIDS=FALSE
    );



    CREATE TABLE "delivery_address" (
        "order_id" int NOT NULL,
        "street_address" TEXT NOT NULL,
        "city" TEXT NOT NULL,
        "state" TEXT NOT NULL,
        "phone_no" bigint NOT NULL
    ) WITH (
    OIDS=FALSE
    );




    ALTER TABLE "orders" ADD CONSTRAINT "orders_fk0" FOREIGN KEY ("user_id") REFERENCES "users"("user_id");


    ALTER TABLE "order_Items" ADD CONSTRAINT "order_Items_fk0" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id");
    ALTER TABLE "order_Items" ADD CONSTRAINT "order_Items_fk1" FOREIGN KEY ("food_id") REFERENCES "menu"("food_id");

    ALTER TABLE "delivery_address" ADD CONSTRAINT "delivery_address_fk0" FOREIGN KEY ("order_id") REFERENCES "orders"("order_id");

    INSERT INTO users ( 
        first_name, last_name, 
        email, 
        password, 
        role
      ) 
    VALUES (
        'Admin', 
        'Admin', 
        'admin@mail.com', 
        '${adminPassword}', 
        'admin'
    );
`;
db.query(tableSchema, (err) => {
  if (err) {
    throw (err);
  }
});
