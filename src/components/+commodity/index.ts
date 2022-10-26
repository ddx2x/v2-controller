import { appManager } from '../+app/manager';
import { commodityLabelLayout } from './+commodity-label/layout';
import { commodityEdit } from './+commodity-list/dialog';
import { commodityTableLayout } from './+commodity-list/layout';

appManager.register('commodity', { table: commodityTableLayout });
appManager.register('commodity-sale', { table: commodityLabelLayout });
appManager.register('commodity-add', { stepForm: commodityEdit });
