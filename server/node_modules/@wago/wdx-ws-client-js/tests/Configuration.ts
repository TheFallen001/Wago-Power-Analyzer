/**
 * eDesign - Runtime - Web Socket Server Package
 *
 * @copyright 2024 Elrest Automations Systeme GMBH
 */

'use strict';

import { Configuration, Protocol } from '../src/WDX/Client/WS/Configuration/Configuration';

export const configuration:Configuration = {
    protocol: Protocol.ws,

    host: "localhost",
  
    port: 4282,
  
    path:""

};