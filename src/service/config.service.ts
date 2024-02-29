import { LoggerCredential } from '@allbridge/logger';
import { Injectable } from '@nestjs/common';
import { ConfigError } from '../error/errors';
import * as dotenv from 'dotenv';

dotenv.config();

const DEFAULT_PORT = 3000;

@Injectable()
export class ConfigService {
  static getPort(): number {
    return +(process.env.PORT || DEFAULT_PORT);
  }

  static getNetworks(): string[] {
    return process.env.NETWORKS ? JSON.parse(process.env.NETWORKS) : [];
  }

  static getNetworkNodeUrl(chainSymbol: string): string {
    const nodeUrl = process.env[`${chainSymbol}_NODE_URL`];
    if (nodeUrl) {
      return nodeUrl;
    }
    throw new ConfigError(`${chainSymbol} node url not found`);
  }

  static getDebug(): boolean {
    return process.env.DEBUG === 'true';
  }

  static getLoggerCredential(): LoggerCredential {
    return process.env.LOGGER_CREDENTIAL
      ? JSON.parse(process.env.LOGGER_CREDENTIAL)
      : [];
  }

  static getTelegramApiKey(): string {
    return process.env.TELEGRAM_API_KEY ? process.env.TELEGRAM_API_KEY : '';
  }

  static getTelegramChatId(): string {
    return process.env.TELEGRAM_CHAT_ID ? process.env.TELEGRAM_CHAT_ID : '';
  }

  static getTelegramThreadId(): string {
    return process.env.TELEGRAM_THREAD_ID ? process.env.TELEGRAM_THREAD_ID : '';
  }

  static getEnvironment() {
    return process.env.ENVIRONMENT || 'local';
  }

  static isProduction() {
    return ConfigService.getEnvironment() === 'production';
  }

  static isStaging() {
    return ConfigService.getEnvironment() === 'staging';
  }

  static getRPCUrls(): { [name: string]: string } {
    const rpcUrls: any = {};
    ConfigService.getNetworks().forEach((chain) => {
      rpcUrls[chain] = ConfigService.getNetworkNodeUrl(chain);
    });
    return rpcUrls;
  }

  static getSystemPrecision() {
    return process.env.SYSTEM_PRECISION ? +process.env.SYSTEM_PRECISION : 9;
  }
}
