<script setup>
  import { ref, onMounted } from 'vue'
  let prompt = "";
  let output = ref("");
  async function callOPENAI() {
    try {
      prompt = document.querySelector('#prompt').value;
      document.querySelector('.generate-button').textContent = 'Loading...';
      const response = await useFetch('/api/generate', {
        method: "POST",
        body: {
          prompt: prompt
        }
      });
      if(response.data._rawValue?.content) {
        output.value = response.data._rawValue.content;
        console.log(output.value)
        document.querySelector('.generate-button').textContent = 'Generate Response';
      } else {
        output.value = response.data._rawValue;
        console.log(output.value)
        document.querySelector('.generate-button').textContent = 'Generate Response';
      }
    } catch(error) {
      console.log('Error happened while generating', error);
      document.querySelector('.generate-button').textContent = 'Generate Response';
    }
    
  }

function copyToClipboard(value) {
if (navigator.clipboard) {
  navigator.clipboard.writeText(value)
    .then(() => {
      console.log('Copied to clipboard');
    })
    .catch((error) => {
      console.error('Failed to copy to clipboard:', error);
    });
} else {
    const element = document.createElement('textarea');
    element.value = value;
    document.body.appendChild(element);
    element.select();

    if (document.execCommand('copy')) {
      console.log('Copied to clipboard');
    } else {
      console.error('Copy to clipboard failed');
    }

    document.body.removeChild(element);
  }
}
</script>


<template>
  <div>
    <h1 class="bg-gray-100 text-6xl font-bold p-12">MasterGPT</h1>
    <div class="p-12">
      <input placeholder="Prompt" type="text" id="prompt" class=" border-gray-300 border-2 pl-2 mr-4 rounded-md h-12 w-80 mb-2"/>
      <button class="generate-button h-12 rounded-full text-white bg-purple-700 pr-4 pl-4 pt-2 pb-2 mb-4" @click="callOPENAI()">Generate Response</button>
      <p class="text-gray-800"><code>{{ output }}</code></p>
      <button class="h-12 rounded-full text-white bg-purple-700 pr-4 pl-4 pt-2 pb-2 mb-4" @click="copyToClipboard(output)">Click</button>
    </div>
  </div>
</template>

