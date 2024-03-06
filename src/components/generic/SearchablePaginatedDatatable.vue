<script setup lang="ts" generic="T">
import type { PaginatedRequest, PaginatedResponse } from "@/models/store";
import { useNotificationsStore } from "@/stores/Notifications";
import type { Ref } from "vue";
import { ref } from "vue";

const props = defineProps({
  headers: {
    type: Array<{ title: string; key: string; sortable?: boolean }>,
    required: true,
  },
  fetchFunction: {
    type: Function,
    required: true,
  },
  fetchArgs: {
    type: Object,
    default: () => ({ stateFilter: undefined }),
  },
});

const search = ref("");
const currentPage = ref(1);
// T is the type of the items in the table (e.g. Process, see <script setup generic="T">):
const serverItems = ref<T[]>([]) as Ref<T[]>;
const serverTotalItems = ref(0);
const currentSortBy = ref<{ key: string; order: "asc" | "desc" }[]>([]);
const currentItemsPerPage = ref(15);
const fetching = ref(false);

const fetchItems = ({
  page,
  itemsPerPage,
  sortBy,
}: {
  page: number;
  itemsPerPage: number;
  sortBy: { key: string; order: "asc" | "desc" }[];
}) => {
  fetching.value = true;
  currentPage.value = page;
  currentItemsPerPage.value = itemsPerPage;
  currentSortBy.value = sortBy;
  return props
    .fetchFunction({
      page,
      itemsPerPage,
      sortBy,
      id: undefined,
      stateFilter: props.fetchArgs.stateFilter,
      search: search.value,
    } as PaginatedRequest<T>)
    .then(({ items, total }: PaginatedResponse<T>) => {
      serverItems.value = items;
      serverTotalItems.value = total;
      fetching.value = false;
    });
};

const reload_datatable = () => {
  fetchItems({
    page: currentPage.value,
    itemsPerPage: currentItemsPerPage.value,
    sortBy: currentSortBy.value,
  }).then(() => {
    const notifications_store = useNotificationsStore();
    notifications_store.pushSuccess("Daten aktualisiert.");
  });
};
</script>

<template>
  <v-row>
    <v-col>
      <v-text-field
        v-model="search"
        label="Durchsuchen"
        hide-details
        clearable
      />
    </v-col>
    <v-col cols="2">
      <v-btn
        color="labmed_beige"
        class="mb-4"
        @click.prevent="reload_datatable"
      >
        Aktualisieren
      </v-btn>
    </v-col>
  </v-row>
  <v-data-table-server
    v-model:items-per-page="currentItemsPerPage"
    :search="search"
    :headers="props.headers"
    :items-length="serverTotalItems"
    :items="serverItems"
    :loading="fetching"
    multi-sort
    @update:options="fetchItems"
  >
    <!-- Pass on all slots -->
    <template v-for="(_, slotname, idx) in ($slots as {})" #[slotname]="item">
      <slot :name="slotname" v-bind="item"></slot>
    </template>
  </v-data-table-server>
</template>
