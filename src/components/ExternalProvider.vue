<template>
  <div :class="['provider', kind]">
    <a :href="url"><i :class="['icon', iconClass]"></i>
      <span class="text"><slot>Login with <strong>{{ label || kind }}</strong></slot></span>
    </a>
  </div>
</template>

<script>
export default {
  name: 'AuthDialog',
  props: {
    kind: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
    },
    label: {
      type: String,
      required: false,
    },
    url: {
      type: String,
      required: true,
    },
  },

  computed: {
    iconClass () {
      return `icon-${this.icon || this.kind}`
    },
  },
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
/deep/ .external-providers {
  border: none;
}

.provider {
  font-size: 15px;
  text-align: left;
  border: 1px solid #000;
  border-radius: 5px;
  line-height: 22px;
  margin: 0 0 10px 0;
  padding: 10px;
  color: white;
  vertical-align: middle;

  a {
    color: #000;
    text-decoration: none;
  }

  &.linkedin {
    background: #0077B5;
  }

  &.facebook {
    background: #3b5998;
  }

  &.github {
    background: #333;
  }

  &.gplus {
    background: #dd4b39;
  }

  &.linkedin,
  &.facebook,
  &.github,
  &.gplus {
    border: none;

    a {
      color: #fff;
    }
  }

  .icon {
    height: 20px;
    width: 20px;
    display: inline-block;
    background-size: 20px;
    background-color: #000;
    vertical-align: top;
    margin-right: 10px;
    border-right: 1px solid #fff;
    mask: url("~@/assets/logos/openid.svg") no-repeat;
    mask-size: 20px;
  }

  .icon-linkedin {
    mask: url("~@/assets/logos/linkedin.svg") no-repeat;
    mask-size: 20px;
    background-color: #fff;
  }

  .icon-facebook {
    mask: url("~@/assets/logos/facebook.svg") no-repeat;
    mask-size: 20px;
    background-color: #fff;
  }

  .icon-github {
    mask: url("~@/assets/logos/github.svg") no-repeat;
    mask-size: 20px;
    background-color: #fff;
  }

  .icon-gplus {
    mask: url("~@/assets/logos/google.svg") no-repeat;
    mask-size: 20px;
    background-color: #fff;
  }
}
</style>
