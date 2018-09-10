<template>
	<div class="apiServiceLine">
		<h2 @click="toggleContent">{{opened? "▼" : "►"}} {{data.title}}</h2>
		<button @click="deleteLine" class="deleteBtn"><img src="@/assets/icons/trash.svg" alt="delete"></button>
		<div class="content" ref="content" v-if="opened">
			<ul>
				<li><span>{{$t("addForm.input.url.label")}} :</span>{{data.url}}</li>
				<li><span>{{$t("addForm.input.selector.label")}} :</span>{{data.selector}}</li>
				<li><span>{{$t("addForm.input.expectedContent.label	")}} :</span>{{data.expectedContent}}</li>
				<li><span>Current status :</span>{{data.pingHistory.length >0? data.pingHistory[data.pingHistory.length].isDown : "unknown"}}</li>
				<button @click="this.$emit('onManualPing')">Execute manual ping</button>
			</ul>
		</div>
	</div>
</template>

<script lang="ts">
import { Component, Inject, Model, Prop, Vue, Watch } from 'vue-property-decorator'
import ApiServiceData from "@/vo/ApiServiceData";
import { TweenLite, Back } from 'gsap';
import Api from '@/utils/Api';
import ApiResult from '@/vo/ApiResult';

@Component({
	props:{
		data:Object as () => ApiServiceData
	}
})
export default class Home extends Vue {

	public opened:boolean = false;

	public mounted():void {
		console.log(this.$props.data);
	}
	
	public deleteLine():void {
		Api.delete("/apiservice", {id:this.$props.data._id}).then((result:ApiResult<boolean>)=> {
			TweenLite.to(this.$el, .35, {scale:0, height:0, margin:0, ease:Back.easeIn, onComplete:()=> {
				this.$emit("ondelete", this.$el, this.$props.data);
			}});
		});
	}

	private toggleContent():void {
		if(this.opened) {
			TweenLite.to(this.$refs.content, .25, {height:0, paddingTop:0, paddingBottom:0, onComplete:()=>{this.opened = false}});
		}else{
			this.opened = true;
			Vue.nextTick(()=> {
				TweenLite.from(this.$refs.content, .25, {paddingTop:0, paddingBottom:0, height:0});
			});
		}
	}
}
</script>

<style lang="less">
 @import (reference) "../less/components";

.apiServiceLine {
	margin-bottom: 15px;
	position: relative;

	h2 {
		margin-bottom: 0;
		z-index: 1;
		display: block;
		position: relative;
		cursor: pointer;
		transition: all .25s;

		&:hover {
			background-color: #fcfcfc;
		}
	}

	.deleteBtn {
		background: none;
		border: none;
		padding: 0;
		margin: 0;
		box-shadow: none;
		position: absolute;
		top: 3px;
		right: 5px;
		z-index: 2;
		img {
			height: 25px;
		}
	}

	.content {
		margin: auto;
		width: calc(100% - 20px);
		background-color: #f8f8f8;
		padding: 15px;
		box-sizing: border-box;
		overflow: hidden;
		.shadow;

		ul {
			li{
				margin-bottom: 5px;
				font-size: 12px;
				&:not(:last-child) {
					padding-bottom: 5px;
					border-bottom: 1px solid #ccc;
				}
				span {
					font-size: 14px;
					font-weight: bold;
					min-width: 130px;
					display: inline-block;	
				}
			}
		}
	}
}
</style>