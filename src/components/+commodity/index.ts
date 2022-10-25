import { appManager } from '../+app/manager';
import { commodityTableLayout } from './+commodity-list/layout';
import { commodityLabelLayout } from './+commodity-label/layout';

appManager.register('commodity', { table: commodityTableLayout });
appManager.register('commodity-sale', { table: commodityLabelLayout });
