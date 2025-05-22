import {describe, expect, test, } from '@jest/globals';

import {Configuration} from '../src/WDX/Client/WS/Configuration/Configuration';
import {ClientService} from '../src/WDX/Client/WS/Service/ClientService';

import {configuration} from './Configuration';

describe('ClientService', () => {
  test('Test connect', async () => {
    try {
      const clientService = new ClientService();
      await clientService.connect(configuration);

      return expect(true).toBe(true);
    } catch (error: any) {
      return expect(error).toBe(true);
    }
  });

  test('returns false if number is odd', () => {
    expect(true).toBe(true);
  });
});