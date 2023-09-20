#!/usr/bin/env node

import { Command } from 'commander';

import * as momo from "./";
import { Credentials } from "./common";
import { MtnMoMoError } from "./errors";

const { version } = require("../package.json");
const program = new Command();

program
  .version(version)
  .description("Create sandbox credentials")
  .option("-x, --host <n>", "Your webhook host")
  .option("-p, --primary-key <n>", "Primary Key")
  .parse(process.argv);

const stringify = (obj: object | string) => JSON.stringify(obj, null, 2);

const options = program.opts();
const { Users } = momo.create({ callbackHost: options.host });

const users = Users({ primaryKey: options.primaryKey });

users
  .create(options.host)
  .then((userId: string) => {
    return users.login(userId).then((credentials: Credentials) => {
      console.log(
        "Momo Sandbox Credentials",
        stringify({
          userSecret: credentials.apiKey,
          userId
        })
      );
    });
  })
  .catch((error: MtnMoMoError) => {
    console.log(error);
  });
