/**
 * SuiteCRM is a customer relationship management program developed by SalesAgility Ltd.
 * Copyright (C) 2023 SalesAgility Ltd.
 *
 * This program is free software; you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License version 3 as published by the
 * Free Software Foundation with the addition of the following permission added
 * to Section 15 as permitted in Section 7(a): FOR ANY PART OF THE COVERED WORK
 * IN WHICH THE COPYRIGHT IS OWNED BY SALESAGILITY, SALESAGILITY DISCLAIMS THE
 * WARRANTY OF NON INFRINGEMENT OF THIRD PARTY RIGHTS.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE. See the GNU Affero General Public License for more
 * details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * In accordance with Section 7(b) of the GNU Affero General Public License
 * version 3, these Appropriate Legal Notices must retain the display of the
 * "Supercharged by SuiteCRM" logo. If the display of the logos is not reasonably
 * feasible for technical reasons, the Appropriate Legal Notices must display
 * the words "Supercharged by SuiteCRM".
 */

import {Injectable} from '@angular/core';
import {emptyObject, SearchCriteriaFilter, ViewMode} from 'common';
import {SubpanelActionData, SubpanelActionHandler} from '../subpanel.action';
import {SubpanelStore} from "../../store/subpanel/subpanel.store";

@Injectable({
    providedIn: 'root'
})
export class SubpanelClearFilterAction extends SubpanelActionHandler {
    key = 'clear-filter';

    modes: ViewMode[] = ['list'];

    shouldDisplay(data: SubpanelActionData): boolean {
        return this.isAnyFilterApplied(data.store);
    }

    run(data: SubpanelActionData): void {
        data.store.clearFilter();
    }

    isAnyFilterApplied(store: SubpanelStore): boolean {
        return this.hasActiveFilter(store) || !this.areAllCurrentCriteriaFilterEmpty(store);
    }

    hasActiveFilter(store: SubpanelStore): boolean {
        const activeFilters = store.recordList.criteria;

        if (emptyObject(activeFilters?.filters)) {
            return false;
        }

        const filterKeys = Object.keys(activeFilters) ?? [];
        if (!filterKeys || !filterKeys.length) {
            return false;
        }

        if (filterKeys.length > 1) {
            return true;
        }

        const currentFilter = activeFilters[filterKeys[0]];

        return currentFilter.key && currentFilter.key !== '' && currentFilter.key !== 'default'
    }

    areAllCurrentCriteriaFilterEmpty(store: SubpanelStore): boolean {
        return Object.keys(this.getFilters(store) ?? {}).every(key => this.getFilters(store)[key].operator === '')
    }

    getFilters(store: SubpanelStore): SearchCriteriaFilter {
        return store?.recordList?.criteria?.filters ?? {};
    }
}
