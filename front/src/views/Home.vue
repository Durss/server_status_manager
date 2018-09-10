<template>
	<div class="home">
		<h1>Server states</h1>
		<AddServiceForm v-on:onadded="refreshList" />
		<ApiServiceLine v-for="service of servicesList" :key="service._id" :data="service" v-on:ondelete="onDeleteItem" v-on:manualPing="onManualPing"/>
	</div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import AddServiceForm from "@/components/AddServiceForm.vue";
import ApiServiceLine from "@/components/ApiServiceLine.vue";
import ApiServiceData from "@/vo/ApiServiceData";
import ApiResult from "@/vo/ApiResult";
import Api from "@/utils/Api";
import { get } from 'http';

@Component({
	components: {
		AddServiceForm,
		ApiServiceLine,
	}
})
export default class Home extends Vue {

	public servicesList:ApiServiceData[] = [];

	public mounted():void {
		this.refreshList();
	}

	public onDeleteItem(element:HTMLElement, data:ApiServiceData):void {
		//Remove item from DOM to make sure it's properly deferenced by vue
		for(let i:number=0; i<this.servicesList.length; i++) {
			if(this.servicesList[i]._id == data._id) {
				this.servicesList.splice(i, 1);
				break;
			}
		}
		this.refreshList();
	}

	public refreshList():void {
		Api.get("/apiservice").then((result:ApiResult<ApiServiceData[]>)=> {
			this.servicesList = result.data;
		});
	}

	public onManualPing():void {
		Api.get("/ping").then((result:ApiResult<ApiServiceData[]>) => {
			this.servicesList = result.data;
		});
	}
}
</script>

<style lang="less">
.home {
	width: 80%;
	margin: auto;
	display: block;
	max-width: 800px; 
}
</style>
