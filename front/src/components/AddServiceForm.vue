<template>
	<div class="addForm">
		<button class="addButton" @click="toggleForm" :class="formOpened? 'opened' : ''"><span>+</span></button>
		<div v-if="formOpened" class="formHolder holder" ref="formHolder">
			<form v-on:submit.prevent="onSubmitForm">
				<label><span>{{$t("addForm.input.title.label")}} :	</span><input type="text" :placeholder="$t('addForm.input.title.placeholder')" v-model="title"></label>
				<label><span>{{$t("addForm.input.url.label")}} :</span><input type="text" :placeholder="$t('addForm.input.url.placeholder')" v-model="url"></label>
				<label><span>{{$t("addForm.input.selector.label")}} :</span><input type="text" :placeholder="$t('addForm.input.selector.placeholder')" v-model="selector"></label>
				<label><span>{{$t("addForm.input.expectedContent.label")}} :</span><input type="text" :placeholder="$t('addForm.input.expectedContent.placeholder')" v-model="expectedContent"></label>
				<input type="submit" :value="$t('addForm.submit')">
			</form>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import { TweenLite } from 'gsap';
import Api from '@/utils/Api';

@Component
export default class Home extends Vue {

	public formOpened:boolean = false;
	public title:string = "";
	public url:string = "";
	public selector:string = "";
	public expectedContent:string = "";

	public mounted():void {
	}

	public onSubmitForm():void {
		let params:any = {
			title:this.title,
			url:this.url,
			selector:this.selector,
			expectedContent:this.expectedContent,
		}
		Api.post("/apiservice", params);
		this.$emit("onadded");
	}

	private toggleForm():void {
		if(this.formOpened) {
			TweenLite.to(this.$refs.formHolder, .25, {height:0, paddingTop:0, paddingBottom:0, onComplete:()=>{this.formOpened = false}});
		}else{
			this.formOpened = true;
			Vue.nextTick(()=> {
			TweenLite.from(this.$refs.formHolder, .25, {height:0, paddingTop:0, paddingBottom:0});
			});
		}
	}

}
</script>

<style lang="less">
.addForm {
	margin-bottom: 20px;

	.addButton {
		width: 40px;
		height: 40px;
		display: block;
		margin: auto;
		border-radius: 50%;
		padding: 0;
		text-align: center;
		margin-bottom: 10px;
		font-size: 38px;
		
		span {
			display: inline-block;
			transition: all .25s;
		}
		&.opened {
			span {
				transform: rotate(45deg);
			}
		}
	}

	.formHolder {
		box-sizing: border-box;
		overflow: hidden;
		
		form {
			label {
				width: 100%;
				display: flex;
				text-align: right;
				span {
					box-sizing: border-box;
					padding-right: 10px;
					flex-grow: 0;
					display: inline-block;
					width: 180px;
				}
				input {
					flex-grow: 1;
				}
			}
		}
	}
}
</style>