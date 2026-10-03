# sync (F4, F5)

Store-and-forward: confirmed records wait on the device until a signal appears, then go to DHIS2, keyed by `record_id` so nothing is duplicated (PR11, PR13). The SMS says only a date and the clinic's name (PR12). Next: move the queue to expo-sqlite and add the DHIS2 export.
