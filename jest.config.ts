// guy_rosenbaum-214424814-roni_tiktuk-213207640
import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/src/'],
  testMatch: ['**/?(*.)+(spec|test).ts'],
  setupFiles: ['<rootDir>/src/tests/jest.setup.ts']
};

export default config;