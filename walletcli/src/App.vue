<template>
    <div class="terminal">
        <div class="terminal-content" id="terminal-content">
            <div class="output info-text">
                Welcome to Ubuntu 22.04.3 LTS (GNU/Linux 5.15.0-89-generic x86_64)<br>
                * Documentation: https://help.ubuntu.com<br>
                * Management: https://landscape.canonical.com<br>
                * Support: https://ubuntu.com/advantage<br>
            </div>
            <Prompt />
        </div>
    </div>
</template>
<script setup lang="ts">
import Prompt from './components/Prompt.vue';
import { onMounted } from 'vue';
import { useTerminal } from './composables/useTerminal';


import { helpCommand } from './composables/command/help-command';
import { clearCommand } from './composables/command/clear-command';
import { walletAdd } from './composables/command/wallet-add';
import { useWallet } from './composables/wallet/useWallet';
import { walletList } from './composables/command/wallet-list';

    const { registerCommand } = useTerminal();
    const { initWallet, wallet } = useWallet();

    onMounted(async () => {
        registerCommand(helpCommand);
        registerCommand(clearCommand);
        registerCommand(walletAdd);
        registerCommand(walletList);

        initWallet();
    });

</script>
