import { ConfigurableModuleBuilder } from '@nestjs/common';
import { DrizzleModuleConfig } from './drizzle.interface';

export const {
  ConfigurableModuleClass: ConfigurableDrizzleModule,
  MODULE_OPTIONS_TOKEN: DRIZZLE_OPTIONS,
} = new ConfigurableModuleBuilder<DrizzleModuleConfig>()
  .setClassMethodName('forRoot')
  .setExtras({}, definition => ({
    ...definition,
    global: true,
  }))
  .build();
