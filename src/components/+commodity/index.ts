import { appManager } from '../+app/manager';
import { CommodityTableLayout } from './+commodity-list/layout';

appManager.register('commodity', { table: CommodityTableLayout });
