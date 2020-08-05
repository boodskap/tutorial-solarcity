function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["auth-signin-auth-signin-module"], {
  /***/
  "./src/app/demo/pages/authentication/auth-signin/auth-signin-routing.module.ts":
  /*!*************************************************************************************!*\
    !*** ./src/app/demo/pages/authentication/auth-signin/auth-signin-routing.module.ts ***!
    \*************************************************************************************/

  /*! exports provided: AuthSigninRoutingModule */

  /***/
  function srcAppDemoPagesAuthenticationAuthSigninAuthSigninRoutingModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AuthSigninRoutingModule", function () {
      return AuthSigninRoutingModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _auth_signin_component__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./auth-signin.component */
    "./src/app/demo/pages/authentication/auth-signin/auth-signin.component.ts");

    var routes = [{
      path: '',
      component: _auth_signin_component__WEBPACK_IMPORTED_MODULE_2__["AuthSigninComponent"]
    }];

    var AuthSigninRoutingModule = function AuthSigninRoutingModule() {
      _classCallCheck(this, AuthSigninRoutingModule);
    };

    AuthSigninRoutingModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: AuthSigninRoutingModule
    });
    AuthSigninRoutingModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function AuthSigninRoutingModule_Factory(t) {
        return new (t || AuthSigninRoutingModule)();
      },
      imports: [[_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)], _angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AuthSigninRoutingModule, {
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AuthSigninRoutingModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"].forChild(routes)],
          exports: [_angular_router__WEBPACK_IMPORTED_MODULE_1__["RouterModule"]]
        }]
      }], null, null);
    })();
    /***/

  },

  /***/
  "./src/app/demo/pages/authentication/auth-signin/auth-signin.component.ts":
  /*!********************************************************************************!*\
    !*** ./src/app/demo/pages/authentication/auth-signin/auth-signin.component.ts ***!
    \********************************************************************************/

  /*! exports provided: AuthSigninComponent */

  /***/
  function srcAppDemoPagesAuthenticationAuthSigninAuthSigninComponentTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AuthSigninComponent", function () {
      return AuthSigninComponent;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var src_app_service_commonservice_service__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! src/app/service/commonservice.service */
    "./src/app/service/commonservice.service.ts");
    /* harmony import */


    var ngx_toastr__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ngx-toastr */
    "./node_modules/ngx-toastr/__ivy_ngcc__/fesm2015/ngx-toastr.js");
    /* harmony import */


    var _angular_router__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! @angular/router */
    "./node_modules/@angular/router/__ivy_ngcc__/fesm2015/router.js");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");

    var AuthSigninComponent =
    /*#__PURE__*/
    function () {
      function AuthSigninComponent(commonService, toastr, router) {
        _classCallCheck(this, AuthSigninComponent);

        this.commonService = commonService;
        this.toastr = toastr;
        this.router = router;
      }

      _createClass(AuthSigninComponent, [{
        key: "ngOnInit",
        value: function ngOnInit() {
          var token = localStorage.getItem('user');

          if (token) {
            this.router.navigateByUrl("/dashboard");
          }
        }
      }, {
        key: "doLogin",
        value: function doLogin() {
          var _this = this;

          if (this.email != "" && this.password != "") {
            var actionURL = 'login';
            var sendObj = {
              email: this.email,
              password: this.password
            };
            this.commonService.postCall(actionURL, sendObj).subscribe(function (res) {
              if (res.login) {
                localStorage.setItem('user', JSON.stringify(res.result.user));

                _this.router.navigateByUrl("/dashboard");

                _this.toastr.success('Signin Successfully!');
              } else {
                _this.toastr.error('Username / Password not valid!', 'Authentication Failed!');
              }
            });
          } else {
            this.toastr.error('Username / Password not valid!');
          }
        }
      }]);

      return AuthSigninComponent;
    }();

    AuthSigninComponent.ɵfac = function AuthSigninComponent_Factory(t) {
      return new (t || AuthSigninComponent)(_angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](src_app_service_commonservice_service__WEBPACK_IMPORTED_MODULE_1__["CommonserviceService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"]), _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdirectiveInject"](_angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]));
    };

    AuthSigninComponent.ɵcmp = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineComponent"]({
      type: AuthSigninComponent,
      selectors: [["app-auth-signin"]],
      decls: 23,
      vars: 2,
      consts: [[1, "auth-wrapper"], [1, "auth-content", "text-center"], [1, "text-black"], ["src", "assets/images/auth/solar-panel.svg", "alt", "", "width", "50", 1, "img-fluid", "mb-4"], [2, "color", "#356fab"], [1, "card", "borderless"], [1, "row", "align-items-center", "text-center"], [1, "col-md-12"], [1, "card-body"], [1, "mb-3", "f-w-400"], [1, "input-group", "mb-3"], ["type", "email", "placeholder", "Email address", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "input-group", "mb-4"], ["type", "password", "placeholder", "Password", 1, "form-control", 3, "ngModel", "ngModelChange"], [1, "form-group", "text-left", "mt-2"], [1, "checkbox", "checkbox-primary", "d-inline"], ["type", "checkbox", "name", "checkbox-fill-1", "id", "checkbox-fill-a1", "checked", ""], ["for", "checkbox-fill-a1", 1, "cr"], [1, "btn", "btn-block", "btn-primary", "mb-4", 3, "click"]],
      template: function AuthSigninComponent_Template(rf, ctx) {
        if (rf & 1) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](0, "div", 0);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](1, "div", 1);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](2, "h2", 2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](3, "img", 3);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](4, "span", 4);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](5, "Solar City");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](6, "div", 5);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](7, "div", 6);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](8, "div", 7);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](9, "div", 8);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](10, "h4", 9);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](11, "Signin");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](12, "div", 10);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](13, "input", 11);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AuthSigninComponent_Template_input_ngModelChange_13_listener($event) {
            return ctx.email = $event;
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](14, "div", 12);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](15, "input", 13);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("ngModelChange", function AuthSigninComponent_Template_input_ngModelChange_15_listener($event) {
            return ctx.password = $event;
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](16, "div", 14);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](17, "div", 15);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelement"](18, "input", 16);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](19, "label", 17);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](20, " \xA0Save credentials");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementStart"](21, "button", 18);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵlistener"]("click", function AuthSigninComponent_Template_button_click_21_listener($event) {
            return ctx.doLogin();
          });

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵtext"](22, "Signin");

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵelementEnd"]();
        }

        if (rf & 2) {
          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](13);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.email);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵadvance"](2);

          _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵproperty"]("ngModel", ctx.password);
        }
      },
      directives: [_angular_forms__WEBPACK_IMPORTED_MODULE_4__["DefaultValueAccessor"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgControlStatus"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["NgModel"]],
      styles: ["\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IiIsImZpbGUiOiJzcmMvYXBwL2RlbW8vcGFnZXMvYXV0aGVudGljYXRpb24vYXV0aC1zaWduaW4vYXV0aC1zaWduaW4uY29tcG9uZW50LnNjc3MifQ== */"]
    });
    /*@__PURE__*/

    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AuthSigninComponent, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["Component"],
        args: [{
          selector: 'app-auth-signin',
          templateUrl: './auth-signin.component.html',
          styleUrls: ['./auth-signin.component.scss']
        }]
      }], function () {
        return [{
          type: src_app_service_commonservice_service__WEBPACK_IMPORTED_MODULE_1__["CommonserviceService"]
        }, {
          type: ngx_toastr__WEBPACK_IMPORTED_MODULE_2__["ToastrService"]
        }, {
          type: _angular_router__WEBPACK_IMPORTED_MODULE_3__["Router"]
        }];
      }, null);
    })();
    /***/

  },

  /***/
  "./src/app/demo/pages/authentication/auth-signin/auth-signin.module.ts":
  /*!*****************************************************************************!*\
    !*** ./src/app/demo/pages/authentication/auth-signin/auth-signin.module.ts ***!
    \*****************************************************************************/

  /*! exports provided: AuthSigninModule */

  /***/
  function srcAppDemoPagesAuthenticationAuthSigninAuthSigninModuleTs(module, __webpack_exports__, __webpack_require__) {
    "use strict";

    __webpack_require__.r(__webpack_exports__);
    /* harmony export (binding) */


    __webpack_require__.d(__webpack_exports__, "AuthSigninModule", function () {
      return AuthSigninModule;
    });
    /* harmony import */


    var _angular_core__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(
    /*! @angular/core */
    "./node_modules/@angular/core/__ivy_ngcc__/fesm2015/core.js");
    /* harmony import */


    var _angular_common__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(
    /*! @angular/common */
    "./node_modules/@angular/common/__ivy_ngcc__/fesm2015/common.js");
    /* harmony import */


    var _auth_signin_routing_module__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(
    /*! ./auth-signin-routing.module */
    "./src/app/demo/pages/authentication/auth-signin/auth-signin-routing.module.ts");
    /* harmony import */


    var _auth_signin_component__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(
    /*! ./auth-signin.component */
    "./src/app/demo/pages/authentication/auth-signin/auth-signin.component.ts");
    /* harmony import */


    var _angular_forms__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(
    /*! @angular/forms */
    "./node_modules/@angular/forms/__ivy_ngcc__/fesm2015/forms.js");

    var AuthSigninModule = function AuthSigninModule() {
      _classCallCheck(this, AuthSigninModule);
    };

    AuthSigninModule.ɵmod = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineNgModule"]({
      type: AuthSigninModule
    });
    AuthSigninModule.ɵinj = _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵdefineInjector"]({
      factory: function AuthSigninModule_Factory(t) {
        return new (t || AuthSigninModule)();
      },
      imports: [[_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _auth_signin_routing_module__WEBPACK_IMPORTED_MODULE_2__["AuthSigninRoutingModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"]]]
    });

    (function () {
      (typeof ngJitMode === "undefined" || ngJitMode) && _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵɵsetNgModuleScope"](AuthSigninModule, {
        declarations: [_auth_signin_component__WEBPACK_IMPORTED_MODULE_3__["AuthSigninComponent"]],
        imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _auth_signin_routing_module__WEBPACK_IMPORTED_MODULE_2__["AuthSigninRoutingModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"]]
      });
    })();
    /*@__PURE__*/


    (function () {
      _angular_core__WEBPACK_IMPORTED_MODULE_0__["ɵsetClassMetadata"](AuthSigninModule, [{
        type: _angular_core__WEBPACK_IMPORTED_MODULE_0__["NgModule"],
        args: [{
          imports: [_angular_common__WEBPACK_IMPORTED_MODULE_1__["CommonModule"], _auth_signin_routing_module__WEBPACK_IMPORTED_MODULE_2__["AuthSigninRoutingModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["FormsModule"], _angular_forms__WEBPACK_IMPORTED_MODULE_4__["ReactiveFormsModule"]],
          declarations: [_auth_signin_component__WEBPACK_IMPORTED_MODULE_3__["AuthSigninComponent"]]
        }]
      }], null, null);
    })();
    /***/

  }
}]);
//# sourceMappingURL=auth-signin-auth-signin-module-es5.js.map