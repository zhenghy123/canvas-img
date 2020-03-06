<template>
  <div class="container">
    <div class="imgCropper">
      <div class="img-crop">
        <div class="tip-name">图片裁剪</div>
        <div
          class="img-position"
          :style="{
            width: canvasWidth + 'px',
            height: canvasHeight + 'px'
          }"
        >
          <div class="back-gray"></div>
          <div
            v-if="showBox"
            :style="{
              position: 'absolute',
              top: boxY + 'px',
              left: boxX + 'px',
              width: boxW + 'px',
              height: boxH + 'px',
              overflow: 'hidden'
            }"
          >
            <img
              id="innerImg"
              :style="{
                position: 'absolute',
                width: canvasWidth + 'px',
                height: canvasHeight + 'px'
              }"
              :src="img1"
            />
          </div>
          <canvas
            id="canvasImg"
            :width="canvasWidth"
            :height="canvasHeight"
          ></canvas>
          <VueDraggableResizable
            v-if="showBox"
            class="drag active"
            ref="crop"
            id="crop"
            :x="boxX"
            :y="boxY"
            :w="boxW"
            :h="boxH"
            :parent="true"
            :active="true"
            :lock-aspect-ratio="true"
            :prevent-deactivation="false"
            :minHeight="60"
            :minWidth="60"
            @dragging="onDragging"
            @resizing="onResizing"
            @dragstop="dragstop"
            @resizestop="resizestop"
          ></VueDraggableResizable>
        </div>
        <br />
        <br />
        <!-- 比例按钮 -->
        <div class="img-rate">
          <el-button
            v-for="(item, index) in previewList"
            :key="index"
            :type="item.img || currentRate == item.rate ? 'primary' : ''"
            size="mini"
            round
            @click="rateClick(item, index)"
            >{{ item.rate }}</el-button
          >
        </div>
      </div>
      <div class="img-preview">
        <div class="tip-name">截图预览</div>
        <div class="img-list">
          <div
            class="img-item"
            v-for="(item, index) in hasImgPreviewList"
            :key="index"
          >
            <img
              class="img"
              :src="item.img"
              :width="(2 / 3) * item.widthPre + 'px'"
              alt="封面图预览"
            />

            <!-- :height="item.h+'px'"
              :width="item.w+'px'"-->
            <div class="img-name">{{ item.name }}</div>
            <svg
              @click="deleteImg(item.index)"
              style="cursor: pointer;position:absolute;top:4px;right:14px;transform: rotate(45deg);"
              width="20px"
              height="20px"
              viewBox="0 0 20 20"
              version="1.1"
              xmlns="http://www.w3.org/2000/svg"
              xmlns:xlink="http://www.w3.org/1999/xlink"
            >
              <path
                d="M0.409648914,10.0000116 L0.409648914,10.0000131 C0.409648914,15.3290818 4.72971253,19.6491454 10.0587812,19.6491454 C15.3878499,19.6491454 19.7079136,15.3290818 19.7079136,10.0000131 L19.7079136,10.0000131 C19.7079136,4.67094439 15.3878499,0.350880772 10.0587812,0.350880772 C4.72971253,0.350880772 0.409648914,4.67094439 0.409648914,10.0000131 L0.409648914,10.0000116 Z"
                id="路径"
                fill="#349FEE"
              ></path>
              <path
                d="M9.53247203,9.47370243 L9.53247203,5.96492882 C9.53247203,5.66668238 9.76054261,5.4386118 10.058789,5.4386118 C10.3570355,5.4386118 10.5851061,5.66668238 10.5851061,5.96492882 L10.5851061,9.47370243 L14.0938797,9.47370243 C14.3921261,9.47370243 14.6201967,9.70177301 14.6201967,10.0000194 C14.6201967,10.2982659 14.3921261,10.5263365 14.0938797,10.5263365 L10.5851061,10.5263365 L10.5851061,14.0351101 C10.5851061,14.3333565 10.3570355,14.5614271 10.058789,14.5614271 C9.76054261,14.5614271 9.53247203,14.3333565 9.53247203,14.0351101 L9.53247203,10.5263365 L6.02369842,10.5263365 C5.72545197,10.5263365 5.4973814,10.2982659 5.4973814,10.0000194 C5.4973814,9.70177301 5.72545197,9.47370243 6.02369842,9.47370243 L9.53247203,9.47370243 Z"
                id="路径"
                fill="#FFFFFF"
              ></path>
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VueDraggableResizable from "vue-draggable-resizable";
import "vue-draggable-resizable/dist/VueDraggableResizable.css";

export default {
  name: "ImgCropper",
  components: {
    VueDraggableResizable
  },
  data() {
    return {
      img1: require("../assets/2.jpg"),
      // img2: require("../assets/2.jpg"),
      // img3: require("../assets/3.jpg"),

      maxWidth: 360, //图片显示最大宽/高
      maxHeight: 220,

      showBox: false,
      boxX: 0,
      boxY: 0,
      boxW: 60,
      boxH: 60,
      rateW: 1,
      rateH: 1,

      canvasWidth: 400,
      canvasHeight: 600,
      currentRate: "",
      currentIndex: 0,
      previewList: [
        {
          img: "",
          rate: "16 : 9",
          index: 0,
          order: 0,
          xpos: 0,
          ypos: 0,
          height: 0,
          width: 0
        },
        {
          img: "",
          rate: "9 : 16",
          index: 1,
          order: 0,
          xpos: 0,
          ypos: 0,
          height: 0,
          width: 0
        },
        {
          img: "",
          rate: "3 : 4",
          index: 2,
          order: 0,
          xpos: 0,
          ypos: 0,
          height: 0,
          width: 0
        },
        {
          img: "",
          rate: "1 : 1",
          index: 4,
          order: 0,
          xpos: 0,
          ypos: 0,
          height: 0,
          width: 0
        }
      ]
    };
  },
  computed: {
    hasImgPreviewList() {
      return this.previewList.filter(item => item.img);
    }
  },
  mounted() {
    console.log("初始化图片数据");
    let img = document.createElement("img");
    img.src = this.img1;
    img.onload = () => {
      console.log("img onload");
      // 对图片原始长宽做处理，方式图片太宽/高
      if (img.width > img.height) {
        if (img.width >= this.maxWidth) {
          this.canvasWidth = this.maxWidth;
          this.canvasHeight = img.height * (this.maxWidth / img.width);

          this.rateW = img.width / this.canvasWidth;
          this.rateH = img.height / this.canvasHeight;
        } else {
          this.canvasWidth = img.width;
          this.canvasHeight = img.height;
        }
      } else {
        if (img.width >= this.maxHeight) {
          this.canvasWidth = this.maxHeight;
          this.canvasHeight = img.height * (this.maxHeight / img.width);

          this.rateW = img.width / this.canvasWidth;
          this.rateH = img.height / this.canvasHeight;
        } else {
          this.canvasWidth = img.width;
          this.canvasHeight = img.height;
        }
      }

      let canvasImg = document.getElementById("canvasImg");
      let ctx = canvasImg.getContext("2d");
      setTimeout(() => {
        ctx.drawImage(
          img,
          0,
          0,
          img.width,
          img.height,
          0,
          0,
          this.canvasWidth,
          this.canvasHeight
        );
      }, 20);
    };
  },
  watch: {
    currentRate(val) {
      if (!val) {
        return;
      }
      this.showBox = false;

      let h = this.canvasHeight;
      let w = this.canvasWidth;

      this.boxX = 0;
      this.boxY = 0;

      if (val) {
        let x = Number(val.split(":")[0].trim());
        let y = Number(val.split(":")[1].trim());

        if (x > y) {
          console.log("宽度大");
          // 宽度大
          if ((y / x) * w > h) {
            // 高度大于图片高度，以最大高度为准
            this.boxH = h;
            this.boxW = (x / y) * h;

            // 居中
            this.boxX = (w - this.boxW) / 2;
          } else if ((y / x) * w < h) {
            this.boxW = w;
            this.boxH = (y / x) * w;

            // 居中
            this.boxY = (h - this.boxH) / 2;
          } else {
            this.boxW = w;
            this.boxH = (y / x) * w;

            // 居中
            this.boxY = (h - this.boxH) / 2;
          }
        } else if (x < y) {
          console.log("高度大");

          // 高度大
          if ((x / y) * h > w) {
            // 宽度大于图片宽度，以最大宽度为准
            this.boxW = w;
            this.boxH = (y / x) * w;

            // 居中
            this.boxY = (h - this.boxH) / 2;
          } else if ((x / y) * h < w) {
            this.boxH = h;
            this.boxW = (x / y) * h;

            // 居中
            this.boxX = (w - this.boxW) / 2;
          } else {
            this.boxH = h;
            this.boxW = (x / y) * h;

            // 居中
            this.boxX = (w - this.boxW) / 2;
          }
        } else {
          console.log("1;1");

          if (w > h) {
            console.log("w > h");

            this.boxW = h;
            this.boxH = h;
            this.boxX = Math.floor((w - h) / 2);
            setTimeout(() => {
              this.boxX = Math.floor((w - h) / 2);
            });
          } else if (w < h) {
            console.log("w < h");
            this.boxW = w;
            this.boxH = w;
            this.boxY = Math.floor((h - w) / 2);
          } else {
            this.boxW = w;
            this.boxH = w;
          }
        }
      }

      setTimeout(() => {
        this.showBox = true;
        this.$nextTick(() => {
          this.setImgLocation();
        });
      }, 0);
    },
    showBox(val) {
      val && this.insertHTML();
    }
  },
  methods: {
    rateClick(item, index) {
      this.currentRate = item.rate;
      this.currentIndex = index;
    },

    cropImg() {
      if (!this.currentRate) {
        this.$message.warning("请选择截图比列!");
        return;
      }

      let dom = document.getElementById("canvasImg");

      var canvas = document.createElement("canvas");
      canvas.width = this.boxW;
      canvas.height = this.boxH;

      let canvasImage = "";
      canvas
        .getContext("2d")
        .drawImage(
          dom,
          this.boxX,
          this.boxY,
          canvas.width,
          canvas.height,
          0,
          0,
          canvas.width,
          canvas.height
        );

      canvasImage = canvas.toDataURL("image/png");

      if (!this.previewList[this.currentIndex].img) {
        let hasImg = this.previewList.filter(item => item.img !== "");
        this.previewList[this.currentIndex].order = hasImg.length;
      }
      this.previewList[this.currentIndex].img = canvasImage;
      this.previewList[this.currentIndex].xpos = this.boxX * this.rateW;
      this.previewList[this.currentIndex].ypos = this.boxY * this.rateH;
      this.previewList[this.currentIndex].width = canvas.width * this.rateW;
      this.previewList[this.currentIndex].widthPre = canvas.width;
      this.previewList[this.currentIndex].height = canvas.height * this.rateH;
      this.previewList[this.currentIndex].heightPre = canvas.height;

      /* eslint-disable */
      // this.previewList[this.currentIndex].type = this.types[
      //   this.previewList[this.currentIndex].rate
      // ];
    },
    insertHTML() {
      let _this = this;
      setTimeout(() => {
        let b = document.getElementById("crop");
        if (b) {
          let div = document.createElement("div");

          div.innerHTML = `
          <svg
               id="svg1"
                style="cursor: pointer;transform: rotate(45deg);"
                width="20px"
                height="20px"
                viewBox="0 0 20 20"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink"
              >
                <path
                  d="M0.409648914,10.0000116 L0.409648914,10.0000131 C0.409648914,15.3290818 4.72971253,19.6491454 10.0587812,19.6491454 C15.3878499,19.6491454 19.7079136,15.3290818 19.7079136,10.0000131 L19.7079136,10.0000131 C19.7079136,4.67094439 15.3878499,0.350880772 10.0587812,0.350880772 C4.72971253,0.350880772 0.409648914,4.67094439 0.409648914,10.0000131 L0.409648914,10.0000116 Z"
                  id="路径"
                  fill="#349FEE"
                ></path>
                <path
                  d="M9.53247203,9.47370243 L9.53247203,5.96492882 C9.53247203,5.66668238 9.76054261,5.4386118 10.058789,5.4386118 C10.3570355,5.4386118 10.5851061,5.66668238 10.5851061,5.96492882 L10.5851061,9.47370243 L14.0938797,9.47370243 C14.3921261,9.47370243 14.6201967,9.70177301 14.6201967,10.0000194 C14.6201967,10.2982659 14.3921261,10.5263365 14.0938797,10.5263365 L10.5851061,10.5263365 L10.5851061,14.0351101 C10.5851061,14.3333565 10.3570355,14.5614271 10.058789,14.5614271 C9.76054261,14.5614271 9.53247203,14.3333565 9.53247203,14.0351101 L9.53247203,10.5263365 L6.02369842,10.5263365 C5.72545197,10.5263365 5.4973814,10.2982659 5.4973814,10.0000194 C5.4973814,9.70177301 5.72545197,9.47370243 6.02369842,9.47370243 L9.53247203,9.47370243 Z"
                  id="路径"
                  fill="#FFFFFF"
                ></path>
              </svg>
            <svg  id="svg2" style="cursor: pointer;" width="20px" height="20px" viewBox="0 0 20 20" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
              <g id="版本1.1.7" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
                    <g id="添加封面图弹窗多张" transform="translate(-735.000000, -446.000000)">
                        <g id="➕-2" transform="translate(730.000000, 441.000000)">
                            <g id="➕" transform="translate(15.000000, 15.000000) rotate(-315.000000) translate(-15.000000, -15.000000) translate(5.000000, 5.000000)">
                                <path d="M0.409648914,10.0000116 L0.409648914,10.0000131 C0.409648914,15.3290818 4.72971253,19.6491454 10.0587812,19.6491454 C15.3878499,19.6491454 19.7079136,15.3290818 19.7079136,10.0000131 L19.7079136,10.0000131 C19.7079136,4.67094439 15.3878499,0.350880772 10.0587812,0.350880772 C4.72971253,0.350880772 0.409648914,4.67094439 0.409648914,10.0000131 L0.409648914,10.0000116 Z" id="路径" fill="#349FEE" fill-rule="nonzero"></path>
                                <polyline id="路径-5" stroke="#FFFFFF" stroke-linecap="round" stroke-linejoin="round" points="7.42893219 13.6213203 11.6715729 13.6213203 11.6715729 5.13603897"></polyline>
                            </g>
                        </g>
                    </g>
                </g>
            </svg>

         `;
          div.className = "cropper-oper";
          b.appendChild(div);
          document.getElementById("svg1").onclick = function() {
            _this.cancelCrop();
          };
          document.getElementById("svg2").onclick = function() {
            _this.cropImg(false);
          };
        }
      });
    },
    setImgLocation() {
      let dom = document.getElementById("innerImg");
      dom.style.left = -this.boxX + "px";
      dom.style.top = -this.boxY + "px";
    },
    onDragging(left, top) {
      this.boxX = left;
      this.boxY = top;
      this.setImgLocation();
    },
    onResizing(left, top, width, height) {
      // console.log('onResizing--', left, top, width, height)

      this.boxX = left;
      this.boxY = top;
      this.boxW = width;
      this.boxH = height;
      this.setImgLocation();
    },
    dragstop() {
      this.setImgLocation();
    },
    resizestop() {
      this.setImgLocation();
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
.container {
  // background: #3d464e;
  height: 100%;
  width: 100%;
  background: url("../assets/back.jpg") 100% 100%;
  .imgCropper {
    height: 100%;
    width: 100%;
    display: flex;
    // padding: 20px;
    .tip-name {
      padding: 15px;
      text-align: left;
    }
    .img-crop {
      margin: 0 40px;
      .img-position {
        display: flex;
        justify-content: center;
        align-items: center;
        position: relative;
        .back-gray {
          position: absolute;
          height: 100%;
          width: 100%;
          background: #303133;
          opacity: 0.5;
        }
      }
    }
    .img-preview {
      max-width: 400px;
      .img-list {
        display: flex;
        flex-wrap: wrap;
        .img-item {
          padding: 0 10px;
          display: flex;
          flex-direction: column;
          position: relative;
          .img {
            // min-height: 40px;
            max-width: 100%;
            max-height: 100%;
          }
          .img-name {
            font-size: 12px;
            padding-bottom: 14px;
            height: 30px;
            line-height: 30px;
          }
        }
      }
    }
  }
  /deep/.drag {
    .cropper-oper {
      position: absolute;
      bottom: -46px;
      right: 8px;
      height: 40px;
    }
    .handle {
      position: absolute;
      width: 10px;
      height: 10px;
      border: 1px solid #333;
      background: none;
    }

    .handle-ml {
      margin-left: -1px;
      border: none;
      // border-right: 2px solid rgba(24, 144, 255, 1);
    }

    .handle-bl {
      bottom: -2px;
      left: -2px;
      border: none;
      border-left: 2px solid rgba(24, 144, 255, 1);
      border-bottom: 2px solid rgba(24, 144, 255, 1);
    }

    .handle-bm {
      bottom: -2px;
      border: none;
      border-bottom: 2px solid rgba(24, 144, 255, 1);
      /* display: none !important; */
    }

    .handle-br {
      bottom: -2px;
      right: -2px;
      border: none;
      border-right: 2px solid rgba(24, 144, 255, 1);
      border-bottom: 2px solid rgba(24, 144, 255, 1);
    }

    .handle-mr {
      right: -2px;
      border: none;
      border-right: 2px solid rgba(24, 144, 255, 1);
    }

    .handle-tr {
      top: -2px;
      right: -2px;
      border: none;
      border-right: 2px solid rgba(24, 144, 255, 1);
      border-top: 2px solid rgba(24, 144, 255, 1);
    }

    .handle-tm {
      top: -2px;
      border: none;
      border-top: 2px solid rgba(24, 144, 255, 1);
    }

    .handle-tl {
      top: -2px;
      left: -2px;
      border: none;
      border-left: 2px solid rgba(24, 144, 255, 1);
      border-top: 2px solid rgba(24, 144, 255, 1);
    }
  }
  .vdr {
    border: none;
  }

  .active.vdr {
    border: 1px solid rgba(24, 144, 255, 1);
  }
}
</style>
