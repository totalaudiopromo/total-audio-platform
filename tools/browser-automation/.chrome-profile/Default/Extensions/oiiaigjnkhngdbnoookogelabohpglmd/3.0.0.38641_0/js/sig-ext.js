!(function () {
  var t = {
      2: function (t, e, r) {
        const { bender: i } = r(3);
        self.hubspot = self.hubspot || {};
        self.hubspot.bender = self.hubspot.bender || { depVersions: { salesImages: '1' } };
        self.hubspot.bender.currentProject = i.project;
        self.hubspot.bender.currentProjectVersion = i.depVersions[i.project];
        self.window && (self.window.hubspot = self.hubspot);
      },
      3: function (t) {
        'use strict';
        t.exports = {
          mode: 'compressed',
          staticDomainPrefix: '//static.hsappstatic.net',
          bender: {
            depVersions: {
              SignalsExtension: 'static-2.32896',
              'ai-components-ui-library': 'static-1.7057',
              autolinker: 'static-3.11',
              'calendar-sdk': 'static-1.9251',
              'emoji-mart': 'static-3.4',
              'head-dlb': 'static-1.4360',
              'hs-test-utils': 'static-1.7301',
              'hubspot-dlb': 'static-2.1702',
              HubStyleTokens: 'static-2.10809',
              I18n: 'static-7.1444',
              immutable: 'static-2.19',
              'jasmine-runner': 'static-1.5718',
              quartz: 'static-1.6093',
              react: 'static-7.151',
              'react-dlb': 'static-1.61',
              'react-dnd': 'static-2.33',
              'react-dnd-html5-backend': 'static-2.10',
              'sales-clients-common': 'static-1.48757',
              'sales-ext-common': 'static-1.39317',
              'settings-ui-lib': 'static-1.11825',
              underscore: 'static-1.8',
              'webpack-env': 'static-1.54',
              'apollo-stack-hubspot': 'static-3.43',
              atom: 'static-1.4445',
              'blueimp-md5': 'static-1.8',
              classnames: 'static-2.10',
              'clients-email-associations': 'static-1.41737',
              'content-assistance-lib': 'static-1.6912',
              crm_components: 'static-3.89644',
              crm_universal: 'static-1.21090',
              csstype: 'static-1.38',
              cssUtils: 'static-1.590',
              'customer-data-objects': 'static-1.6925',
              'customer-data-objects-ui-components': 'static-1.12253',
              'customer-data-properties': 'static-1.49183',
              'customer-data-property-utils': 'static-1.7250',
              'customer-data-reference-ui-components': 'static-1.12345',
              'customer-data-ui-utilities': 'static-1.9058',
              'data-fetching-client': 'static-1.8953',
              enviro: 'static-4.328',
              'everywhere-content': 'static-1.20823',
              'foundations-assets': 'static-1.4167',
              'foundations-components': 'static-1.6779',
              'foundations-theming': 'static-1.3629',
              'frontend-preferences-client': 'static-1.7227',
              GmailXhrInterceptor: 'static-1.435',
              'google-calendar': 'static-1.12853',
              graphql: 'static-1.65',
              HeadJS: 'static-2.619',
              'hoist-non-react-statics': 'static-3.9',
              'hs-everywhere-components': 'static-1.63249',
              'hs-promise-rejection-tracking': 'static-1.4750',
              'hs-promise-utils': 'static-1.4819',
              'hub-http': 'static-1.5499',
              'hub-http-contrib': 'static-1.2410',
              'hubspot-apollo-client': 'static-1.4120',
              'hubspot-url-utils': 'static-1.3516',
              HubStyle: 'static-2.11117',
              'i18n-data': 'static-1.207',
              icons: 'static-2.593',
              'immutable-less': 'static-1.3854',
              InboxConnectUtils: 'static-4.12923',
              jquery: 'static-3.6',
              'metrics-js': 'static-1.9032',
              moment: 'static-3.26',
              'moment-timezone': 'static-5.66',
              NamespacedHubStyle: 'static-2.8572',
              PatternValidationJS: 'static-1.437',
              PortalIdParser: 'static-2.306',
              'property-translator': 'static-1.4681',
              raven: 'static-3.5229',
              'raven-hubspot': 'static-1.5536',
              'react-dom': 'static-7.85',
              'react-immutable-proptypes': 'static-2.8',
              'react-input-autosize': 'static-2.17',
              'react-redux': 'static-7.16',
              'react-rhumb': 'static-1.15882',
              'react-select-plus': 'static-1.65',
              'react-utils': 'static-2.4702',
              'react-virtualized': 'static-2.80',
              redux: 'static-4.16',
              'redux-thunk': 'static-2.43',
              'reference-resolvers': 'static-1.7464',
              'reference-resolvers-lite': 'static-1.7333',
              'reporting-data': 'static-1.64608',
              reselect: 'static-2.16',
              'sales-clients-common-tasks-applet': 'static-1.45031',
              'sales-ext-config': 'static-1.24613',
              'sales-ext-kratos': 'static-1.39315',
              'sales-ext-popup': 'static-1.39311',
              'sales-ext-sidepanel': 'static-1.17197',
              SalesExtensionRemoteAssets: 'static-1.61948',
              salesImages: 'static-1.508',
              SalesSidebar: 'static-2.45671',
              sanitize: 'static-1.3671',
              'sanitize-text': 'static-1.7446',
              sassPrefix: 'static-1.139',
              'sequences-lib': 'static-1.6982',
              SharedI18nStrings: 'static-1.170',
              'signup-constants': 'static-1.17397',
              'signup-ui-lego-core': 'static-1.19407',
              'signup-ui-url-generator': 'static-2.7370',
              'styled-components': 'static-2.64',
              StyleGuideUI: 'static-3.475',
              'task-forms-lib': 'static-1.39634',
              tether: 'static-3.25',
              'timezone-utils': 'static-2.4508',
              transmute: 'static-2.75',
              'ui-addon-i18n': 'static-1.10283',
              'ui-addon-iframeable': 'static-1.8203',
              'ui-addon-sales-email': 'static-1.4496',
              'ui-deal-management-components-lib': 'static-1.17775',
              'ui-fonts': 'static-1.333',
              'ui-images': 'static-2.955',
              'ui-shepherd-react': 'static-3.9365',
              UIComponents: 'static-3.7756',
              urlinator: 'static-1.3833',
              'usage-tracker': 'static-1.6737',
              'usage-tracker-core': 'static-1.6587',
              'bend-plugin-trellis-migration': 'static-1.2849',
              'chatspot-client-types': 'static-1.9917',
              'chatspot-core': 'static-1.18603',
              ContentUtils: 'static-1.66040',
              'copilot-toolkit': 'static-1.9182',
              'foundations-theming-base': 'static-1.2614',
              'foundations-theming-specialty': 'static-1.1345',
              'hs-story-utils': 'static-1.8660',
              msw: 'static-1.39',
              'quartz-core': 'static-1.5312',
              'rpc-client-utils': 'static-1.4002',
              'framer-motion': 'static-1.51',
              'hs-test-utils-bend-plugin': 'static-1.2412',
              'testing-library': 'static-1.133',
              jasmine: 'static-4.3620',
              'quartz-core-utils': 'static-1.2960',
              ExtensionInstallHelpers: 'static-1.576',
              'ui-coaching-tips': 'static-1.26411',
              'flux-actions': 'static-1.285',
              'react-colorpicker': 'static-2.9556',
              'redux-observable': 'static-1.11',
              ReduxMessenger: 'static-2.9761',
              rxjs: 'static-5.10',
              'usage-tracker-container': 'static-1.6727',
              'apollo-dlb': 'static-3.41',
              'customer-data-communicator': 'static-1.43483',
              'salesclients-service-types': 'static-1.24438',
              'universal-associations-select': 'static-1.10202',
              'react-transition-group': 'static-1.7',
              superstore: 'static-1.4031',
              'ui-addon-video-player': 'static-1.8059',
              'conversations-skeleton-state': 'static-1.6658',
              'customer-data-content': 'static-1.25948',
              'react-immutable-render-mixin': 'static-1.9',
              crm_schema: 'static-3.89683',
              FormUrlGenerator: 'static-2.4008',
              'inbound-db-properties-service-client': 'static-1.3322',
              'avatar-components': 'static-1.1775',
              'calling-cross-tab-library': 'static-1.18569',
              'calling-global-api': 'static-1.61905',
              'calling-integration-cross-tab': 'static-1.21100',
              'calling-internal-common': 'static-1.30571',
              'calling-lifecycle-internal': 'static-1.63287',
              'calling-lifecycle-messages': 'static-1.55582',
              'commerce-products-lib': 'static-1.7375',
              'conditional-properties-service-client': 'static-1.3279',
              'crm-links': 'static-1.5464',
              'crm-message-bus': 'static-1.40898',
              'external-options-client-types': 'static-1.3493',
              'file-manager-components': 'static-1.21526',
              'framework-data-schema-resolvers': 'static-1.6186',
              'google-libphonenumber': 'static-1.18',
              'inbound-db-meta-service-client': 'static-1.3098',
              'inbounddb-objects-service-types': 'static-1.3591',
              'object-builder-ui-client': 'static-1.46321',
              'pipeline-validation-client-types': 'static-1.3284',
              'smart-property-lib': 'static-1.4138',
              'ui-addon-form-validation': 'static-1.10319',
              'user-context': 'static-1.4495',
              'react-dnd-compat': 'static-1.3968',
              'directed-graph': 'static-1.226',
              'event-emitter': 'static-1.294',
              'fast-json-stable-stringify': 'static-1.4',
              'bend-plugin-foundations-components': 'static-1.3048',
              'floating-ui': 'static-1.39',
              'react-aria': 'static-1.44',
              'tanstack-table': 'static-1.23',
              'bend-plugin-foundations-theming': 'static-1.2112',
              'hub-http-janus': 'static-1.691',
              'quick-fetch': 'static-1.2772',
              'hs-lodash': 'static-4.45',
              'commerce-contract-lib': 'static-1.9666',
              'task-queues': 'static-1.32698',
              'apollo-link-hub-http': 'static-2.4038',
              immer: 'static-1.33',
              'batch-promise': 'static-1.893',
              'reporting-client-types': 'static-1.2237',
              'redux-mock-store': 'static-1.8',
              'chatspot-widget-iframe': 'static-1.18595',
              'hubspot-prosemirror': 'static-1.16242',
              crm_data: 'static-4.89644',
              'ui-addon-upgrades': 'static-9.16908',
              'customer-data-email': 'static-1.16813',
              'draft-js': 'static-5.37',
              prosemirror: 'static-1.13',
              'sequences-client-types-lib': 'static-1.6839',
              'emoji-regex': 'static-1.7',
              'crm-activity-creator-data': 'static-1.44168',
              'foundations-components-test-utils': 'static-1.4263',
              'magpie-lib': 'static-1.4955',
              'navigation-messaging': 'static-1.5275',
              'customer-data-filters-ui': 'static-1.37078',
              'ts-schema': 'static-1.3491',
              'markdown-it': 'static-1.6',
              'cms-field-types': 'static-1.4062',
              'content-icons-ui': 'static-1.2003',
              'magpie-types': 'static-1.4415',
              'simple-logging-lib': 'static-1.2303',
              dispatcher: 'static-1.120',
              'general-store': 'static-6.20',
              history: 'static-4.47',
              'hub-http-shared-msw-handlers': 'static-1.8258',
              'hubspotter-http': 'static-1.3965',
              'hubspotter-http-shared-msw-handlers': 'static-1.8256',
              'mobile-manifest-mixins': 'static-1.390',
              'platform-navigation-bootstrap': 'static-1.11772',
              'react-router-dom': 'static-5.26',
              'growth-onboarding-feedback-components': 'static-1.5790',
              'calling-error-reporting': 'static-1.30577',
              'calling-usage-tracker': 'static-1.5788',
              'crm-display-components': 'static-1.22872',
              'crm-fe-perf': 'static-1.22275',
              'crm-legacy-global-containers': 'static-1.23084',
              'customer-data-rte': 'static-1.31315',
              'customer-data-tracking': 'static-1.6138',
              'draft-content-plugins': 'static-1.26665',
              'draft-convert': 'static-2.31',
              'draft-email-branding-plugin': 'static-2.22648',
              'draft-extend': 'static-2.46',
              'draft-plugins': 'static-2.20387',
              'draft-signature-plugin': 'static-1.22352',
              EmailSignatureEditor: 'static-1.22888',
              FileManagerCore: 'static-1.37025',
              FileManagerLib: 'static-1.37166',
              'hubspot-prosemirror-plugins': 'static-1.16234',
              'integration-settings-components': 'static-1.13165',
              'integrations-lib': 'static-1.13871',
              'integrations-tracking-lib': 'static-1.4920',
              'native-integrations-shared-strings': 'static-1.7115',
              'nav-meta': 'static-1.27585',
              'outreach-assistant-email-generation': 'static-1.4834',
              'quotes-client-types': 'static-1.35519',
              'rich-text-lib': 'static-1.18553',
              'sales-email-signature-service-client': 'static-1.3234',
              'ui-business-units-lib': 'static-1.8214',
              'ui-gdpr-components': 'static-1.9529',
              'whatsapp-sending-lib': 'static-1.3356',
              SalesContentIndexUI: 'static-3.8073',
              'self-service-api': 'static-1.9537',
              'shared-worker-versioning': 'static-1.10364',
              'worker-connection-library': 'static-1.15553',
              'calling-orchestration-shared-library': 'static-1.33253',
              'onboarding-scopes': 'static-1.5828',
              'growth-payments-core': 'static-1.23325',
              'products-iframe-lib': 'static-1.6017',
              'products-ui-components-shared-msw-handlers': 'static-1.8641',
              'location-customization-utils-lib': 'static-1.6999',
              immerable: 'static-1.3423',
              'video-components-external': 'static-1.9124',
              'video-data-lib': 'static-1.32782',
              'crm-pipelines-api-client-types': 'static-1.3465',
              'framework-builder-read-service-client': 'static-1.3439',
              'framework-data-schema-quick-fetch': 'static-1.6091',
              'persist-promise': 'static-1.3051',
              'breeze-intelligence-kit': 'static-1.4635',
              'data-token-picker': 'static-1.15190',
              'framework-data-schema-resolvers-shared-msw-handlers': 'static-1.8342',
              fsm: 'static-1.3006',
              'policy-lib': 'static-1.6062',
              'react-tinymce': 'static-1.53194',
              'reference-resolvers-lite-shared-msw-handlers': 'static-1.8404',
              tinymce: 'static-5.11',
              'tinymce-config': 'static-2.52320',
              'tinymce-plugins': 'static-1.55434',
              'tinymce-themes': 'static-1.54290',
              'getting-started-shared-tasks': 'static-1.16404',
              'getting-started-shared-tasks-store': 'static-1.15522',
              'commerce-billing-lib': 'static-1.17151',
              'commerce-shared-components-lib': 'static-1.16663',
              'crm-cards-sdk': 'static-1.41373',
              'payments-enrollment-embed-lib': 'static-1.20294',
              'usage-tracker-session-replay': 'static-1.4423',
              'utility-belt': 'static-1.1807',
              zustand: 'static-1.51',
              'guided-actions-lib': 'static-1.18771',
              'knowledge-content-types': 'static-1.8008',
              'payment-link-components': 'static-1.21617',
              'ui-addon-emoji-picker': 'static-1.9229',
              'feature-store-service-types': 'static-1.3974',
              'growth-monetization-service-types': 'static-1.3981',
              'merchandise-lib': 'static-1.231',
              'upgrade-management-service-types': 'static-1.3965',
              'idb-keyval': 'static-1.27',
              'reactive-lib': 'static-1.55',
              'customer-data-filters-ui-msw-helpers': 'static-1.19512',
              lodash: 'static-4.7',
              'multi-account-reference-resolvers': 'static-1.287',
              'onboarding-tours': 'static-1.15460',
              'ui-addon-teams': 'static-1.20630',
              'platform-infra-nav-components': 'static-1.7074',
              'crm-component-utils': 'static-1.37122',
              'framework-data-table': 'static-2.10366',
              'viral-links-lib': 'static-1.6198',
              'audio-components': 'static-1.5051',
              cropperjs: 'static-1.10',
              FileManagerImages: 'static-1.34677',
              'redux-toolkit': 'static-1.7',
              'video-components': 'static-1.11127',
              'video-embed': 'static-1.33616',
              'content-embed-lib': 'static-1.6634',
              'crm-record-cards-service-types': 'static-1.3067',
              'data-model-builder-lib': 'static-1.9872',
              'remote-ui': 'static-1.50',
              'ui-components-test-utils': 'static-1.4947',
              'ui-extensions-remote-renderer': 'static-1.15193',
              'universal-page-editor-lib': 'static-1.2325',
              'integrations-error-boundary-lib': 'static-1.11286',
              'laboratory-lib': 'static-3.6500',
              'messaging-types-lib': 'static-1.43703',
              'whatsapp-management-lib': 'static-1.6515',
              FireAlarmUi: 'static-1.3988',
              'sales-templates-service-types-lib': 'static-1.3550',
              'ui-asset-management-lib': 'static-1.9987',
              'calling-orchestration-schema': 'static-1.33478',
              'commerce-analytics-service-client': 'static-1.2968',
              'ui-addon-opt': 'static-4.7816',
              'multi-currency-client-types': 'static-1.3101',
              'sales-views-client-types': 'static-1.3565',
              'content-media-composition-data-lib': 'static-1.9362',
              'content-media-compositions': 'static-2.13369',
              'media-bridge-lib': 'static-1.17790',
              highcharts: 'static-8.87',
              'trellis-story-utils': 'static-1.3845',
              'storybook-react': 'static-1.14',
              interframe: 'static-3.4073',
              'tinymce-data': 'static-1.38405',
              codemirror: 'static-5.78',
              'layout-dnd-components': 'static-1.11290',
              'layout-dnd-utils': 'static-1.10265',
              'react-codemirror': 'static-1.9905',
              'ui-brand-identity-lib': 'static-1.11903',
              'commerce-tools-ui-lib': 'static-1.8667',
              'crm-actions': 'static-1.5472',
              'growth-onboarding-confetti': 'static-1.2388',
              'growth-onboarding-reliability': 'static-1.4435',
              'marketplace-ui-apps-core': 'static-1.16039',
              'stripe-embedded-components': 'static-1.6365',
              'amplitude-session-replay-browser': 'static-1.43',
              'commerce-tours-lib': 'static-1.4968',
              'sales-checkout-service-client': 'static-1.2980',
              'growth-data-modal': 'static-1.4593',
              'growth-onboarding-next-action-utils': 'static-1.651',
              'navigation-components': 'static-1.15948',
              'ui-shepherd-tracker': 'static-1.6746',
              'ui-universal-auth': 'static-1.8143',
              'card-properties-lib': 'static-1.42081',
              'customer-data-properties-shared-msw-handlers': 'static-1.7586',
              'customer-data-associations': 'static-1.6513',
              'ui-addon-draggable': 'static-3.4166',
              'social-insights-client-types': 'static-1.19980',
              outpost: 'static-1.3635',
              'association-settings-lib': 'static-1.8266',
              'collaboration-sidebar': 'static-1.55890',
              'data-model-commons-lib': 'static-1.10553',
              'feedback-loader': 'static-1.27868',
              'final-form': 'static-1.49',
              'html-to-image': 'static-1.36',
              'object-definition-builder-lib': 'static-1.6255',
              'property-management-iframe': 'static-1.10654',
              reactflow: 'static-1.43',
              'used-in-list-lib': 'static-1.6110',
              'visual-association': 'static-1.5060',
              'reporting-visualizations': 'static-1.56685',
              'ui-extensibility-client-types': 'static-1.3359',
              'automation-platform-service-types': 'static-1.2299',
              ContentData: 'static-1.66115',
              'email-portal-health-service-types': 'static-1.330',
              'marketing-email-service-types': 'static-1.1596',
              'cv-backend-services': 'static-1.1323',
              'short-messages-app-service-client': 'static-1.3346',
              'ui-tool-access': 'static-1.9373',
              'hls.js': 'static-1.22',
              'diff-match-patch': 'static-1.7',
              'layout-data-lib': 'static-1.8590',
              'browser-eslint': 'static-2.57',
              'growth-onboarding-empty-states': 'static-1.4775',
              'payments-post-enroll-local-storage-lib': 'static-1.4382',
              'qrcode-generator': 'static-1.50',
              'trials-service-types': 'static-1.3382',
              'developer-experience-shared-components': 'static-1.9642',
              'marketplace-ui-client-types': 'static-1.14912',
              'marketplace-ui-common': 'static-1.17505',
              'ui-addon-integrations-directory-panel': 'static-2.7337',
              'stripe-connect-js': 'static-1.43',
              'onboarding-tours-client': 'static-1.3775',
              'customer-data-sidebar': 'static-2.44044',
              'enrichment-properties-lib': 'static-1.13256',
              'react-flip-move': 'static-1.53',
              'association-translator': 'static-1.2467',
              'crm-settings-header-lib': 'static-1.7492',
              'settings-ui-nav': 'static-2.9408',
              'collaboration-sidebar-common': 'static-1.686',
              'property-management-common': 'static-1.2941',
              d3: 'static-1.7',
              'crm-object-map': 'static-1.4065',
              ExportDialog: 'static-6.9746',
              'ui-addon-react-router-dom': 'static-1.8897',
              'apps-service-types': 'static-1.3309',
              'oauth-service-types': 'static-1.3551',
              'ai-settings-ui-library': 'static-1.6654',
              'react-window': 'static-1.13',
              'card-payment-highlight-lib': 'static-1.35150',
              'card-subscription-highlight-lib': 'static-1.37428',
              'invoices-highlight-card-lib': 'static-1.52446',
              'orders-highlight-card-lib': 'static-1.19728',
              'products-highlight-card-lib': 'static-1.15660',
              'project-storage': 'static-1.3996',
              'quotes-highlight-card-lib': 'static-1.69435',
              'wootric-nps': 'static-1.6138',
              'crm-source-interpretation-lib': 'static-1.4583',
              'usage-based-billing-components-lib': 'static-1.6762',
              'crm-index-visualization-object-layout': 'static-1.3654',
              'crm-object-search-query-utilities': 'static-1.8080',
              'commerce-subscription-lib': 'static-1.35005',
              'accounting-integrations-ui-components': 'static-1.5898',
              'invoices-ui-lib': 'static-1.52462',
              'commerce-products-api': 'static-1.1194',
              SafeStorage: 'static-1.3684',
              'invoices-iframe-lib': 'static-1.54520',
              'quotes-modal-lib': 'static-1.100107',
              'quotes-ui-lib': 'static-1.78150',
              'reporting-ui-components': 'static-2.61883',
              'subscription-experience-data-types': 'static-1.13595',
              'totals-ui-components': 'static-1.21680',
              'products-ui-components': 'static-1.37895',
              'reporting-action-components': 'static-1.39315',
              'reporting-plugins': 'static-1.9113',
              'reporting-reports': 'static-1.64289',
              'reporting-snowflake': 'static-1.53228',
              'commerce-totals-service-types': 'static-1.3228',
              'property-description-translator': 'static-1.3132',
              'tiered-pricing': 'static-1.152',
              'dashboard-lib': 'static-1.78852',
              'share-with-third-party-component-lib': 'static-1.7990',
              'campaign-roi-lib': 'static-1.6740',
              'reporting-datasets-permissions-lib': 'static-1.11386',
              'redux-actions': 'static-3.7',
            },
            depPathPrefixes: {
              SignalsExtension: '/SignalsExtension/static-2.32896',
              'ai-components-ui-library': '/ai-components-ui-library/static-1.7057',
              autolinker: '/autolinker/static-3.11',
              'calendar-sdk': '/calendar-sdk/static-1.9251',
              'emoji-mart': '/emoji-mart/static-3.4',
              'head-dlb': '/head-dlb/static-1.4360',
              'hs-test-utils': '/hs-test-utils/static-1.7301',
              'hubspot-dlb': '/hubspot-dlb/static-2.1702',
              HubStyleTokens: '/HubStyleTokens/static-2.10809',
              I18n: '/I18n/static-7.1444',
              immutable: '/immutable/static-2.19',
              'jasmine-runner': '/jasmine-runner/static-1.5718',
              quartz: '/quartz/static-1.6093',
              react: '/react/static-7.151',
              'react-dlb': '/react-dlb/static-1.61',
              'react-dnd': '/react-dnd/static-2.33',
              'react-dnd-html5-backend': '/react-dnd-html5-backend/static-2.10',
              'sales-clients-common': '/sales-clients-common/static-1.48757',
              'sales-ext-common': '/sales-ext-common/static-1.39317',
              'settings-ui-lib': '/settings-ui-lib/static-1.11825',
              underscore: '/underscore/static-1.8',
              'webpack-env': '/webpack-env/static-1.54',
              'apollo-stack-hubspot': '/apollo-stack-hubspot/static-3.43',
              atom: '/atom/static-1.4445',
              'blueimp-md5': '/blueimp-md5/static-1.8',
              classnames: '/classnames/static-2.10',
              'clients-email-associations': '/clients-email-associations/static-1.41737',
              'content-assistance-lib': '/content-assistance-lib/static-1.6912',
              crm_components: '/crm_components/static-3.89644',
              crm_universal: '/crm_universal/static-1.21090',
              csstype: '/csstype/static-1.38',
              cssUtils: '/cssUtils/static-1.590',
              'customer-data-objects': '/customer-data-objects/static-1.6925',
              'customer-data-objects-ui-components':
                '/customer-data-objects-ui-components/static-1.12253',
              'customer-data-properties': '/customer-data-properties/static-1.49183',
              'customer-data-property-utils': '/customer-data-property-utils/static-1.7250',
              'customer-data-reference-ui-components':
                '/customer-data-reference-ui-components/static-1.12345',
              'customer-data-ui-utilities': '/customer-data-ui-utilities/static-1.9058',
              'data-fetching-client': '/data-fetching-client/static-1.8953',
              enviro: '/enviro/static-4.328',
              'everywhere-content': '/everywhere-content/static-1.20823',
              'foundations-assets': '/foundations-assets/static-1.4167',
              'foundations-components': '/foundations-components/static-1.6779',
              'foundations-theming': '/foundations-theming/static-1.3629',
              'frontend-preferences-client': '/frontend-preferences-client/static-1.7227',
              GmailXhrInterceptor: '/GmailXhrInterceptor/static-1.435',
              'google-calendar': '/google-calendar/static-1.12853',
              graphql: '/graphql/static-1.65',
              HeadJS: '/HeadJS/static-2.619',
              'hoist-non-react-statics': '/hoist-non-react-statics/static-3.9',
              'hs-everywhere-components': '/hs-everywhere-components/static-1.63249',
              'hs-promise-rejection-tracking': '/hs-promise-rejection-tracking/static-1.4750',
              'hs-promise-utils': '/hs-promise-utils/static-1.4819',
              'hub-http': '/hub-http/static-1.5499',
              'hub-http-contrib': '/hub-http-contrib/static-1.2410',
              'hubspot-apollo-client': '/hubspot-apollo-client/static-1.4120',
              'hubspot-url-utils': '/hubspot-url-utils/static-1.3516',
              HubStyle: '/HubStyle/static-2.11117',
              'i18n-data': '/i18n-data/static-1.207',
              icons: '/icons/static-2.593',
              'immutable-less': '/immutable-less/static-1.3854',
              InboxConnectUtils: '/InboxConnectUtils/static-4.12923',
              jquery: '/jquery/static-3.6',
              'metrics-js': '/metrics-js/static-1.9032',
              moment: '/moment/static-3.26',
              'moment-timezone': '/moment-timezone/static-5.66',
              NamespacedHubStyle: '/NamespacedHubStyle/static-2.8572',
              PatternValidationJS: '/PatternValidationJS/static-1.437',
              PortalIdParser: '/PortalIdParser/static-2.306',
              'property-translator': '/property-translator/static-1.4681',
              raven: '/raven/static-3.5229',
              'raven-hubspot': '/raven-hubspot/static-1.5536',
              'react-dom': '/react-dom/static-7.85',
              'react-immutable-proptypes': '/react-immutable-proptypes/static-2.8',
              'react-input-autosize': '/react-input-autosize/static-2.17',
              'react-redux': '/react-redux/static-7.16',
              'react-rhumb': '/react-rhumb/static-1.15882',
              'react-select-plus': '/react-select-plus/static-1.65',
              'react-utils': '/react-utils/static-2.4702',
              'react-virtualized': '/react-virtualized/static-2.80',
              redux: '/redux/static-4.16',
              'redux-thunk': '/redux-thunk/static-2.43',
              'reference-resolvers': '/reference-resolvers/static-1.7464',
              'reference-resolvers-lite': '/reference-resolvers-lite/static-1.7333',
              'reporting-data': '/reporting-data/static-1.64608',
              reselect: '/reselect/static-2.16',
              'sales-clients-common-tasks-applet':
                '/sales-clients-common-tasks-applet/static-1.45031',
              'sales-ext-config': '/sales-ext-config/static-1.24613',
              'sales-ext-kratos': '/sales-ext-kratos/static-1.39315',
              'sales-ext-popup': '/sales-ext-popup/static-1.39311',
              'sales-ext-sidepanel': '/sales-ext-sidepanel/static-1.17197',
              SalesExtensionRemoteAssets: '/SalesExtensionRemoteAssets/static-1.61948',
              salesImages: '/salesImages/static-1.508',
              SalesSidebar: '/SalesSidebar/static-2.45671',
              sanitize: '/sanitize/static-1.3671',
              'sanitize-text': '/sanitize-text/static-1.7446',
              sassPrefix: '/sassPrefix/static-1.139',
              'sequences-lib': '/sequences-lib/static-1.6982',
              SharedI18nStrings: '/SharedI18nStrings/static-1.170',
              'signup-constants': '/signup-constants/static-1.17397',
              'signup-ui-lego-core': '/signup-ui-lego-core/static-1.19407',
              'signup-ui-url-generator': '/signup-ui-url-generator/static-2.7370',
              'styled-components': '/styled-components/static-2.64',
              StyleGuideUI: '/StyleGuideUI/static-3.475',
              'task-forms-lib': '/task-forms-lib/static-1.39634',
              tether: '/tether/static-3.25',
              'timezone-utils': '/timezone-utils/static-2.4508',
              transmute: '/transmute/static-2.75',
              'ui-addon-i18n': '/ui-addon-i18n/static-1.10283',
              'ui-addon-iframeable': '/ui-addon-iframeable/static-1.8203',
              'ui-addon-sales-email': '/ui-addon-sales-email/static-1.4496',
              'ui-deal-management-components-lib':
                '/ui-deal-management-components-lib/static-1.17775',
              'ui-fonts': '/ui-fonts/static-1.333',
              'ui-images': '/ui-images/static-2.955',
              'ui-shepherd-react': '/ui-shepherd-react/static-3.9365',
              UIComponents: '/UIComponents/static-3.7756',
              urlinator: '/urlinator/static-1.3833',
              'usage-tracker': '/usage-tracker/static-1.6737',
              'usage-tracker-core': '/usage-tracker-core/static-1.6587',
              'bend-plugin-trellis-migration': '/bend-plugin-trellis-migration/static-1.2849',
              'chatspot-client-types': '/chatspot-client-types/static-1.9917',
              'chatspot-core': '/chatspot-core/static-1.18603',
              ContentUtils: '/ContentUtils/static-1.66040',
              'copilot-toolkit': '/copilot-toolkit/static-1.9182',
              'foundations-theming-base': '/foundations-theming-base/static-1.2614',
              'foundations-theming-specialty': '/foundations-theming-specialty/static-1.1345',
              'hs-story-utils': '/hs-story-utils/static-1.8660',
              msw: '/msw/static-1.39',
              'quartz-core': '/quartz-core/static-1.5312',
              'rpc-client-utils': '/rpc-client-utils/static-1.4002',
              'framer-motion': '/framer-motion/static-1.51',
              'hs-test-utils-bend-plugin': '/hs-test-utils-bend-plugin/static-1.2412',
              'testing-library': '/testing-library/static-1.133',
              jasmine: '/jasmine/static-4.3620',
              'quartz-core-utils': '/quartz-core-utils/static-1.2960',
              ExtensionInstallHelpers: '/ExtensionInstallHelpers/static-1.576',
              'ui-coaching-tips': '/ui-coaching-tips/static-1.26411',
              'flux-actions': '/flux-actions/static-1.285',
              'react-colorpicker': '/react-colorpicker/static-2.9556',
              'redux-observable': '/redux-observable/static-1.11',
              ReduxMessenger: '/ReduxMessenger/static-2.9761',
              rxjs: '/rxjs/static-5.10',
              'usage-tracker-container': '/usage-tracker-container/static-1.6727',
              'apollo-dlb': '/apollo-dlb/static-3.41',
              'customer-data-communicator': '/customer-data-communicator/static-1.43483',
              'salesclients-service-types': '/salesclients-service-types/static-1.24438',
              'universal-associations-select': '/universal-associations-select/static-1.10202',
              'react-transition-group': '/react-transition-group/static-1.7',
              superstore: '/superstore/static-1.4031',
              'ui-addon-video-player': '/ui-addon-video-player/static-1.8059',
              'conversations-skeleton-state': '/conversations-skeleton-state/static-1.6658',
              'customer-data-content': '/customer-data-content/static-1.25948',
              'react-immutable-render-mixin': '/react-immutable-render-mixin/static-1.9',
              crm_schema: '/crm_schema/static-3.89683',
              FormUrlGenerator: '/FormUrlGenerator/static-2.4008',
              'inbound-db-properties-service-client':
                '/inbound-db-properties-service-client/static-1.3322',
              'avatar-components': '/avatar-components/static-1.1775',
              'calling-cross-tab-library': '/calling-cross-tab-library/static-1.18569',
              'calling-global-api': '/calling-global-api/static-1.61905',
              'calling-integration-cross-tab': '/calling-integration-cross-tab/static-1.21100',
              'calling-internal-common': '/calling-internal-common/static-1.30571',
              'calling-lifecycle-internal': '/calling-lifecycle-internal/static-1.63287',
              'calling-lifecycle-messages': '/calling-lifecycle-messages/static-1.55582',
              'commerce-products-lib': '/commerce-products-lib/static-1.7375',
              'conditional-properties-service-client':
                '/conditional-properties-service-client/static-1.3279',
              'crm-links': '/crm-links/static-1.5464',
              'crm-message-bus': '/crm-message-bus/static-1.40898',
              'external-options-client-types': '/external-options-client-types/static-1.3493',
              'file-manager-components': '/file-manager-components/static-1.21526',
              'framework-data-schema-resolvers': '/framework-data-schema-resolvers/static-1.6186',
              'google-libphonenumber': '/google-libphonenumber/static-1.18',
              'inbound-db-meta-service-client': '/inbound-db-meta-service-client/static-1.3098',
              'inbounddb-objects-service-types': '/inbounddb-objects-service-types/static-1.3591',
              'object-builder-ui-client': '/object-builder-ui-client/static-1.46321',
              'pipeline-validation-client-types': '/pipeline-validation-client-types/static-1.3284',
              'smart-property-lib': '/smart-property-lib/static-1.4138',
              'ui-addon-form-validation': '/ui-addon-form-validation/static-1.10319',
              'user-context': '/user-context/static-1.4495',
              'react-dnd-compat': '/react-dnd-compat/static-1.3968',
              'directed-graph': '/directed-graph/static-1.226',
              'event-emitter': '/event-emitter/static-1.294',
              'fast-json-stable-stringify': '/fast-json-stable-stringify/static-1.4',
              'bend-plugin-foundations-components':
                '/bend-plugin-foundations-components/static-1.3048',
              'floating-ui': '/floating-ui/static-1.39',
              'react-aria': '/react-aria/static-1.44',
              'tanstack-table': '/tanstack-table/static-1.23',
              'bend-plugin-foundations-theming': '/bend-plugin-foundations-theming/static-1.2112',
              'hub-http-janus': '/hub-http-janus/static-1.691',
              'quick-fetch': '/quick-fetch/static-1.2772',
              'hs-lodash': '/hs-lodash/static-4.45',
              'commerce-contract-lib': '/commerce-contract-lib/static-1.9666',
              'task-queues': '/task-queues/static-1.32698',
              'apollo-link-hub-http': '/apollo-link-hub-http/static-2.4038',
              immer: '/immer/static-1.33',
              'batch-promise': '/batch-promise/static-1.893',
              'reporting-client-types': '/reporting-client-types/static-1.2237',
              'redux-mock-store': '/redux-mock-store/static-1.8',
              'chatspot-widget-iframe': '/chatspot-widget-iframe/static-1.18595',
              'hubspot-prosemirror': '/hubspot-prosemirror/static-1.16242',
              crm_data: '/crm_data/static-4.89644',
              'ui-addon-upgrades': '/ui-addon-upgrades/static-9.16908',
              'customer-data-email': '/customer-data-email/static-1.16813',
              'draft-js': '/draft-js/static-5.37',
              prosemirror: '/prosemirror/static-1.13',
              'sequences-client-types-lib': '/sequences-client-types-lib/static-1.6839',
              'emoji-regex': '/emoji-regex/static-1.7',
              'crm-activity-creator-data': '/crm-activity-creator-data/static-1.44168',
              'foundations-components-test-utils':
                '/foundations-components-test-utils/static-1.4263',
              'magpie-lib': '/magpie-lib/static-1.4955',
              'navigation-messaging': '/navigation-messaging/static-1.5275',
              'customer-data-filters-ui': '/customer-data-filters-ui/static-1.37078',
              'ts-schema': '/ts-schema/static-1.3491',
              'markdown-it': '/markdown-it/static-1.6',
              'cms-field-types': '/cms-field-types/static-1.4062',
              'content-icons-ui': '/content-icons-ui/static-1.2003',
              'magpie-types': '/magpie-types/static-1.4415',
              'simple-logging-lib': '/simple-logging-lib/static-1.2303',
              dispatcher: '/dispatcher/static-1.120',
              'general-store': '/general-store/static-6.20',
              history: '/history/static-4.47',
              'hub-http-shared-msw-handlers': '/hub-http-shared-msw-handlers/static-1.8258',
              'hubspotter-http': '/hubspotter-http/static-1.3965',
              'hubspotter-http-shared-msw-handlers':
                '/hubspotter-http-shared-msw-handlers/static-1.8256',
              'mobile-manifest-mixins': '/mobile-manifest-mixins/static-1.390',
              'platform-navigation-bootstrap': '/platform-navigation-bootstrap/static-1.11772',
              'react-router-dom': '/react-router-dom/static-5.26',
              'growth-onboarding-feedback-components':
                '/growth-onboarding-feedback-components/static-1.5790',
              'calling-error-reporting': '/calling-error-reporting/static-1.30577',
              'calling-usage-tracker': '/calling-usage-tracker/static-1.5788',
              'crm-display-components': '/crm-display-components/static-1.22872',
              'crm-fe-perf': '/crm-fe-perf/static-1.22275',
              'crm-legacy-global-containers': '/crm-legacy-global-containers/static-1.23084',
              'customer-data-rte': '/customer-data-rte/static-1.31315',
              'customer-data-tracking': '/customer-data-tracking/static-1.6138',
              'draft-content-plugins': '/draft-content-plugins/static-1.26665',
              'draft-convert': '/draft-convert/static-2.31',
              'draft-email-branding-plugin': '/draft-email-branding-plugin/static-2.22648',
              'draft-extend': '/draft-extend/static-2.46',
              'draft-plugins': '/draft-plugins/static-2.20387',
              'draft-signature-plugin': '/draft-signature-plugin/static-1.22352',
              EmailSignatureEditor: '/EmailSignatureEditor/static-1.22888',
              FileManagerCore: '/FileManagerCore/static-1.37025',
              FileManagerLib: '/FileManagerLib/static-1.37166',
              'hubspot-prosemirror-plugins': '/hubspot-prosemirror-plugins/static-1.16234',
              'integration-settings-components': '/integration-settings-components/static-1.13165',
              'integrations-lib': '/integrations-lib/static-1.13871',
              'integrations-tracking-lib': '/integrations-tracking-lib/static-1.4920',
              'native-integrations-shared-strings':
                '/native-integrations-shared-strings/static-1.7115',
              'nav-meta': '/nav-meta/static-1.27585',
              'outreach-assistant-email-generation':
                '/outreach-assistant-email-generation/static-1.4834',
              'quotes-client-types': '/quotes-client-types/static-1.35519',
              'rich-text-lib': '/rich-text-lib/static-1.18553',
              'sales-email-signature-service-client':
                '/sales-email-signature-service-client/static-1.3234',
              'ui-business-units-lib': '/ui-business-units-lib/static-1.8214',
              'ui-gdpr-components': '/ui-gdpr-components/static-1.9529',
              'whatsapp-sending-lib': '/whatsapp-sending-lib/static-1.3356',
              SalesContentIndexUI: '/SalesContentIndexUI/static-3.8073',
              'self-service-api': '/self-service-api/static-1.9537',
              'shared-worker-versioning': '/shared-worker-versioning/static-1.10364',
              'worker-connection-library': '/worker-connection-library/static-1.15553',
              'calling-orchestration-shared-library':
                '/calling-orchestration-shared-library/static-1.33253',
              'onboarding-scopes': '/onboarding-scopes/static-1.5828',
              'growth-payments-core': '/growth-payments-core/static-1.23325',
              'products-iframe-lib': '/products-iframe-lib/static-1.6017',
              'products-ui-components-shared-msw-handlers':
                '/products-ui-components-shared-msw-handlers/static-1.8641',
              'location-customization-utils-lib': '/location-customization-utils-lib/static-1.6999',
              immerable: '/immerable/static-1.3423',
              'video-components-external': '/video-components-external/static-1.9124',
              'video-data-lib': '/video-data-lib/static-1.32782',
              'crm-pipelines-api-client-types': '/crm-pipelines-api-client-types/static-1.3465',
              'framework-builder-read-service-client':
                '/framework-builder-read-service-client/static-1.3439',
              'framework-data-schema-quick-fetch':
                '/framework-data-schema-quick-fetch/static-1.6091',
              'persist-promise': '/persist-promise/static-1.3051',
              'breeze-intelligence-kit': '/breeze-intelligence-kit/static-1.4635',
              'data-token-picker': '/data-token-picker/static-1.15190',
              'framework-data-schema-resolvers-shared-msw-handlers':
                '/framework-data-schema-resolvers-shared-msw-handlers/static-1.8342',
              fsm: '/fsm/static-1.3006',
              'policy-lib': '/policy-lib/static-1.6062',
              'react-tinymce': '/react-tinymce/static-1.53194',
              'reference-resolvers-lite-shared-msw-handlers':
                '/reference-resolvers-lite-shared-msw-handlers/static-1.8404',
              tinymce: '/tinymce/static-5.11',
              'tinymce-config': '/tinymce-config/static-2.52320',
              'tinymce-plugins': '/tinymce-plugins/static-1.55434',
              'tinymce-themes': '/tinymce-themes/static-1.54290',
              'getting-started-shared-tasks': '/getting-started-shared-tasks/static-1.16404',
              'getting-started-shared-tasks-store':
                '/getting-started-shared-tasks-store/static-1.15522',
              'commerce-billing-lib': '/commerce-billing-lib/static-1.17151',
              'commerce-shared-components-lib': '/commerce-shared-components-lib/static-1.16663',
              'crm-cards-sdk': '/crm-cards-sdk/static-1.41373',
              'payments-enrollment-embed-lib': '/payments-enrollment-embed-lib/static-1.20294',
              'usage-tracker-session-replay': '/usage-tracker-session-replay/static-1.4423',
              'utility-belt': '/utility-belt/static-1.1807',
              zustand: '/zustand/static-1.51',
              'guided-actions-lib': '/guided-actions-lib/static-1.18771',
              'knowledge-content-types': '/knowledge-content-types/static-1.8008',
              'payment-link-components': '/payment-link-components/static-1.21617',
              'ui-addon-emoji-picker': '/ui-addon-emoji-picker/static-1.9229',
              'feature-store-service-types': '/feature-store-service-types/static-1.3974',
              'growth-monetization-service-types':
                '/growth-monetization-service-types/static-1.3981',
              'merchandise-lib': '/merchandise-lib/static-1.231',
              'upgrade-management-service-types': '/upgrade-management-service-types/static-1.3965',
              'idb-keyval': '/idb-keyval/static-1.27',
              'reactive-lib': '/reactive-lib/static-1.55',
              'customer-data-filters-ui-msw-helpers':
                '/customer-data-filters-ui-msw-helpers/static-1.19512',
              lodash: '/lodash/static-4.7',
              'multi-account-reference-resolvers':
                '/multi-account-reference-resolvers/static-1.287',
              'onboarding-tours': '/onboarding-tours/static-1.15460',
              'ui-addon-teams': '/ui-addon-teams/static-1.20630',
              'platform-infra-nav-components': '/platform-infra-nav-components/static-1.7074',
              'crm-component-utils': '/crm-component-utils/static-1.37122',
              'framework-data-table': '/framework-data-table/static-2.10366',
              'viral-links-lib': '/viral-links-lib/static-1.6198',
              'audio-components': '/audio-components/static-1.5051',
              cropperjs: '/cropperjs/static-1.10',
              FileManagerImages: '/FileManagerImages/static-1.34677',
              'redux-toolkit': '/redux-toolkit/static-1.7',
              'video-components': '/video-components/static-1.11127',
              'video-embed': '/video-embed/static-1.33616',
              'content-embed-lib': '/content-embed-lib/static-1.6634',
              'crm-record-cards-service-types': '/crm-record-cards-service-types/static-1.3067',
              'data-model-builder-lib': '/data-model-builder-lib/static-1.9872',
              'remote-ui': '/remote-ui/static-1.50',
              'ui-components-test-utils': '/ui-components-test-utils/static-1.4947',
              'ui-extensions-remote-renderer': '/ui-extensions-remote-renderer/static-1.15193',
              'universal-page-editor-lib': '/universal-page-editor-lib/static-1.2325',
              'integrations-error-boundary-lib': '/integrations-error-boundary-lib/static-1.11286',
              'laboratory-lib': '/laboratory-lib/static-3.6500',
              'messaging-types-lib': '/messaging-types-lib/static-1.43703',
              'whatsapp-management-lib': '/whatsapp-management-lib/static-1.6515',
              FireAlarmUi: '/FireAlarmUi/static-1.3988',
              'sales-templates-service-types-lib':
                '/sales-templates-service-types-lib/static-1.3550',
              'ui-asset-management-lib': '/ui-asset-management-lib/static-1.9987',
              'calling-orchestration-schema': '/calling-orchestration-schema/static-1.33478',
              'commerce-analytics-service-client':
                '/commerce-analytics-service-client/static-1.2968',
              'ui-addon-opt': '/ui-addon-opt/static-4.7816',
              'multi-currency-client-types': '/multi-currency-client-types/static-1.3101',
              'sales-views-client-types': '/sales-views-client-types/static-1.3565',
              'content-media-composition-data-lib':
                '/content-media-composition-data-lib/static-1.9362',
              'content-media-compositions': '/content-media-compositions/static-2.13369',
              'media-bridge-lib': '/media-bridge-lib/static-1.17790',
              highcharts: '/highcharts/static-8.87',
              'trellis-story-utils': '/trellis-story-utils/static-1.3845',
              'storybook-react': '/storybook-react/static-1.14',
              interframe: '/interframe/static-3.4073',
              'tinymce-data': '/tinymce-data/static-1.38405',
              codemirror: '/codemirror/static-5.78',
              'layout-dnd-components': '/layout-dnd-components/static-1.11290',
              'layout-dnd-utils': '/layout-dnd-utils/static-1.10265',
              'react-codemirror': '/react-codemirror/static-1.9905',
              'ui-brand-identity-lib': '/ui-brand-identity-lib/static-1.11903',
              'commerce-tools-ui-lib': '/commerce-tools-ui-lib/static-1.8667',
              'crm-actions': '/crm-actions/static-1.5472',
              'growth-onboarding-confetti': '/growth-onboarding-confetti/static-1.2388',
              'growth-onboarding-reliability': '/growth-onboarding-reliability/static-1.4435',
              'marketplace-ui-apps-core': '/marketplace-ui-apps-core/static-1.16039',
              'stripe-embedded-components': '/stripe-embedded-components/static-1.6365',
              'amplitude-session-replay-browser': '/amplitude-session-replay-browser/static-1.43',
              'commerce-tours-lib': '/commerce-tours-lib/static-1.4968',
              'sales-checkout-service-client': '/sales-checkout-service-client/static-1.2980',
              'growth-data-modal': '/growth-data-modal/static-1.4593',
              'growth-onboarding-next-action-utils':
                '/growth-onboarding-next-action-utils/static-1.651',
              'navigation-components': '/navigation-components/static-1.15948',
              'ui-shepherd-tracker': '/ui-shepherd-tracker/static-1.6746',
              'ui-universal-auth': '/ui-universal-auth/static-1.8143',
              'card-properties-lib': '/card-properties-lib/static-1.42081',
              'customer-data-properties-shared-msw-handlers':
                '/customer-data-properties-shared-msw-handlers/static-1.7586',
              'customer-data-associations': '/customer-data-associations/static-1.6513',
              'ui-addon-draggable': '/ui-addon-draggable/static-3.4166',
              'social-insights-client-types': '/social-insights-client-types/static-1.19980',
              outpost: '/outpost/static-1.3635',
              'association-settings-lib': '/association-settings-lib/static-1.8266',
              'collaboration-sidebar': '/collaboration-sidebar/static-1.55890',
              'data-model-commons-lib': '/data-model-commons-lib/static-1.10553',
              'feedback-loader': '/feedback-loader/static-1.27868',
              'final-form': '/final-form/static-1.49',
              'html-to-image': '/html-to-image/static-1.36',
              'object-definition-builder-lib': '/object-definition-builder-lib/static-1.6255',
              'property-management-iframe': '/property-management-iframe/static-1.10654',
              reactflow: '/reactflow/static-1.43',
              'used-in-list-lib': '/used-in-list-lib/static-1.6110',
              'visual-association': '/visual-association/static-1.5060',
              'reporting-visualizations': '/reporting-visualizations/static-1.56685',
              'ui-extensibility-client-types': '/ui-extensibility-client-types/static-1.3359',
              'automation-platform-service-types':
                '/automation-platform-service-types/static-1.2299',
              ContentData: '/ContentData/static-1.66115',
              'email-portal-health-service-types':
                '/email-portal-health-service-types/static-1.330',
              'marketing-email-service-types': '/marketing-email-service-types/static-1.1596',
              'cv-backend-services': '/cv-backend-services/static-1.1323',
              'short-messages-app-service-client':
                '/short-messages-app-service-client/static-1.3346',
              'ui-tool-access': '/ui-tool-access/static-1.9373',
              'hls.js': '/hls.js/static-1.22',
              'diff-match-patch': '/diff-match-patch/static-1.7',
              'layout-data-lib': '/layout-data-lib/static-1.8590',
              'browser-eslint': '/browser-eslint/static-2.57',
              'growth-onboarding-empty-states': '/growth-onboarding-empty-states/static-1.4775',
              'payments-post-enroll-local-storage-lib':
                '/payments-post-enroll-local-storage-lib/static-1.4382',
              'qrcode-generator': '/qrcode-generator/static-1.50',
              'trials-service-types': '/trials-service-types/static-1.3382',
              'developer-experience-shared-components':
                '/developer-experience-shared-components/static-1.9642',
              'marketplace-ui-client-types': '/marketplace-ui-client-types/static-1.14912',
              'marketplace-ui-common': '/marketplace-ui-common/static-1.17505',
              'ui-addon-integrations-directory-panel':
                '/ui-addon-integrations-directory-panel/static-2.7337',
              'stripe-connect-js': '/stripe-connect-js/static-1.43',
              'onboarding-tours-client': '/onboarding-tours-client/static-1.3775',
              'customer-data-sidebar': '/customer-data-sidebar/static-2.44044',
              'enrichment-properties-lib': '/enrichment-properties-lib/static-1.13256',
              'react-flip-move': '/react-flip-move/static-1.53',
              'association-translator': '/association-translator/static-1.2467',
              'crm-settings-header-lib': '/crm-settings-header-lib/static-1.7492',
              'settings-ui-nav': '/settings-ui-nav/static-2.9408',
              'collaboration-sidebar-common': '/collaboration-sidebar-common/static-1.686',
              'property-management-common': '/property-management-common/static-1.2941',
              d3: '/d3/static-1.7',
              'crm-object-map': '/crm-object-map/static-1.4065',
              ExportDialog: '/ExportDialog/static-6.9746',
              'ui-addon-react-router-dom': '/ui-addon-react-router-dom/static-1.8897',
              'apps-service-types': '/apps-service-types/static-1.3309',
              'oauth-service-types': '/oauth-service-types/static-1.3551',
              'ai-settings-ui-library': '/ai-settings-ui-library/static-1.6654',
              'react-window': '/react-window/static-1.13',
              'card-payment-highlight-lib': '/card-payment-highlight-lib/static-1.35150',
              'card-subscription-highlight-lib': '/card-subscription-highlight-lib/static-1.37428',
              'invoices-highlight-card-lib': '/invoices-highlight-card-lib/static-1.52446',
              'orders-highlight-card-lib': '/orders-highlight-card-lib/static-1.19728',
              'products-highlight-card-lib': '/products-highlight-card-lib/static-1.15660',
              'project-storage': '/project-storage/static-1.3996',
              'quotes-highlight-card-lib': '/quotes-highlight-card-lib/static-1.69435',
              'wootric-nps': '/wootric-nps/static-1.6138',
              'crm-source-interpretation-lib': '/crm-source-interpretation-lib/static-1.4583',
              'usage-based-billing-components-lib':
                '/usage-based-billing-components-lib/static-1.6762',
              'crm-index-visualization-object-layout':
                '/crm-index-visualization-object-layout/static-1.3654',
              'crm-object-search-query-utilities':
                '/crm-object-search-query-utilities/static-1.8080',
              'commerce-subscription-lib': '/commerce-subscription-lib/static-1.35005',
              'accounting-integrations-ui-components':
                '/accounting-integrations-ui-components/static-1.5898',
              'invoices-ui-lib': '/invoices-ui-lib/static-1.52462',
              'commerce-products-api': '/commerce-products-api/static-1.1194',
              SafeStorage: '/SafeStorage/static-1.3684',
              'invoices-iframe-lib': '/invoices-iframe-lib/static-1.54520',
              'quotes-modal-lib': '/quotes-modal-lib/static-1.100107',
              'quotes-ui-lib': '/quotes-ui-lib/static-1.78150',
              'reporting-ui-components': '/reporting-ui-components/static-2.61883',
              'subscription-experience-data-types':
                '/subscription-experience-data-types/static-1.13595',
              'totals-ui-components': '/totals-ui-components/static-1.21680',
              'products-ui-components': '/products-ui-components/static-1.37895',
              'reporting-action-components': '/reporting-action-components/static-1.39315',
              'reporting-plugins': '/reporting-plugins/static-1.9113',
              'reporting-reports': '/reporting-reports/static-1.64289',
              'reporting-snowflake': '/reporting-snowflake/static-1.53228',
              'commerce-totals-service-types': '/commerce-totals-service-types/static-1.3228',
              'property-description-translator': '/property-description-translator/static-1.3132',
              'tiered-pricing': '/tiered-pricing/static-1.152',
              'dashboard-lib': '/dashboard-lib/static-1.78852',
              'share-with-third-party-component-lib':
                '/share-with-third-party-component-lib/static-1.7990',
              'campaign-roi-lib': '/campaign-roi-lib/static-1.6740',
              'reporting-datasets-permissions-lib':
                '/reporting-datasets-permissions-lib/static-1.11386',
              'redux-actions': '/redux-actions/static-3.7',
            },
            project: 'SignalsExtension',
            staticDomain: '//static.hsappstatic.net',
            staticDomainPrefix: '//static.hsappstatic.net',
          },
        };
      },
      13: function (t, e, r) {
        'use strict';
        r.r(e);
        const i = [
            'api',
            'local',
            'app',
            'private',
            'platform',
            'tools',
            'meetings',
            'payments',
            'mcp',
          ],
          n = ['hubspotstarter', 'hubspotfree', 'hubspotemail'],
          s = ['growth'],
          a = {
            com: [
              'hubspot',
              'hubteam',
              'grader',
              'getsignals',
              'getsidekick',
              'gettally',
              'hubspotemail',
              'customer-hub',
              'hubspotservicehub',
              'hubspotquote',
              'hubspotdocuments',
              'hs-data-privacy',
            ].join('|'),
            net: n.join('|'),
            org: s.join('|'),
          },
          o = function t(e) {
            const r = new RegExp(
                `^(?!local|test|selenium)(.*\\.)?(${Object.entries(a)
                  .map(([t, e]) => `(?:${e})(qa)?\\.${t}`)
                  .join(
                    '|'
                  )}|(?:connect)\\.com|(?:connect)(qa)\\.co|wthubspot\\.(com|de|es|fr|jp))$`
              ).test(e.hostname),
              n = new RegExp(
                `${Object.entries(a)
                  .map(([t, e]) => `(?:${e})qa\\.${t}`)
                  .join(
                    '|'
                  )}|(?:connect)qa\\.co|wthubspot\\.(com|de|es|fr|jp)|hsqa-sales(?:crm)?-sub\\.com|(?:hubspotstarter|hubspotfree|hubspotemail)(qa)(?:-.*)\\.net|(?:hubspotemail)(qa)(?:-.*)\\.com`
              ),
              s = [
                new RegExp(`^(?:${i.join('|')})-(.*).(?:hubspot|hubteam)(?:qa)?.com`),
                new RegExp('^(.*).(?:hubspotquote)(?:qa)?.com'),
                new RegExp('^app-(.*).(?:hubspotdocuments)(?:qa)?.com'),
                new RegExp('^(?:[0-9]+).(.*).hs(?:qa)?-sales(?:crm)?-sub.com'),
                new RegExp(
                  '^hs-(?:[0-9]+).s.(?:hubspotfree|hubspotstarter|hubspotemail)(?:qa)?-(.*).net'
                ),
                new RegExp('^hs-(?:[0-9]+).s.(?:hubspotemail)(?:qa)?-(.*).com'),
                new RegExp('^t.sidekickopen(?:\\d)+-([a-z]+[0-9]).com'),
                new RegExp('^([a-z]+[0-9]).hs-data-privacy(?:qa)?.com'),
              ],
              o = 'ENV',
              c =
                'Enviro error: the default argument for .get and .getShort is no longer supported',
              u = t => {
                let e = window[t];
                if (null == e)
                  try {
                    e = window.sessionStorage.getItem(t);
                  } catch (t) {}
                if (null == e)
                  try {
                    e = window.localStorage.getItem(t);
                  } catch (t) {}
                return e;
              },
              l = () => {
                const t = u(o);
                return t || (n.test(e.host) ? 'qa' : 'prod');
              },
              p = (t, e) => {
                window[t] = e;
                return e;
              },
              h = { prod: 'production', qa: 'development' },
              f = t => {
                if ('string' == typeof t) {
                  const e = t.toLowerCase();
                  return h[e] || e;
                }
                return t;
              },
              d = t => {
                t = 'string' == typeof t ? t.toLowerCase() : void 0;
                return Object.keys(h).find(e => t === h[e]) || t;
              },
              m = (t, e) => {
                if (null != e) throw new Error(c);
                let r = null;
                if (t) {
                  const e = t.split('.').reverse();
                  for (let t = 0; t < e.length; t++) {
                    const i = e[t];
                    r = u(`${i.toUpperCase()}_ENV`);
                    if (r) break;
                  }
                }
                if (null == r) {
                  const t = l();
                  r = null != t ? t : 'qa';
                }
                return f(r);
              },
              g = function (t, e) {
                if (1 === arguments.length) {
                  e = t;
                  t = o;
                }
                return p(t, e);
              },
              _ = (t, e) => {
                if (null != e) throw new Error(c);
                return d(m(t));
              },
              v = _,
              b = t => 'prod' === v(t),
              y = t => 'qa' === v(t),
              E = () => {
                const t = u('HUBLET');
                if (t) return t;
                for (const t of s) if (t.test(e.hostname)) return t.exec(e.hostname)[1];
                return 'na1';
              };
            function w({ isNa1: t, isNonNa1: e }, r) {
              r || (r = E());
              return 'na1' === r
                ? 'function' == typeof t
                  ? t(r)
                  : void 0
                : 'function' == typeof e
                  ? e(r)
                  : void 0;
            }
            return {
              createEnviro: t,
              debug: (t, e = !1) => {
                let r;
                'string' == typeof t && (r = u(`${t.toUpperCase()}_DEBUG`));
                null == r && (r = u('DEBUG'));
                return null == r ? e : r;
              },
              denormalize: d,
              deployed: t => {
                let e;
                'string' == typeof t && (e = u(`${t.toUpperCase()}_DEPLOYED`));
                null == e && (e = u('DEPLOYED'));
                return null == e ? r : !!e;
              },
              enabled: (t, e = !1) => {
                let r = u(`${t.toUpperCase()}_ENABLED`);
                null == r && (r = JSON.stringify(e));
                return 'true' === `${r}`.toLowerCase();
              },
              get: m,
              getHublet: E,
              getInternal: _,
              getShort: v,
              isProd: b,
              isQa: y,
              ifHublet: w,
              normalize: f,
              set: g,
              setDebug: (t, e = !0) => {
                if ('string' == typeof t)
                  try {
                    e
                      ? localStorage.setItem(`${t.toUpperCase()}_DEBUG`, JSON.stringify(!0))
                      : localStorage.removeItem(`${t.toUpperCase()}_DEBUG`);
                  } catch (r) {
                    p(`${t.toUpperCase()}_DEBUG`, e || void 0);
                  }
                else {
                  e = null == t || t;
                  try {
                    e
                      ? localStorage.setItem('DEBUG', JSON.stringify(e))
                      : localStorage.removeItem('DEBUG');
                  } catch (t) {
                    p('DEBUG', e || void 0);
                  }
                }
              },
            };
          };
        e.default = o(document.location);
      },
      18: function (t, e, r) {
        var { Raven: i } = r(19),
          n =
            'undefined' != typeof window
              ? window
              : void 0 !== r.g
                ? r.g
                : 'undefined' != typeof self
                  ? self
                  : {},
          s = n.Raven,
          a = new i();
        a.noConflict = function () {
          n.Raven = s;
          return a;
        };
        a.afterLoad();
        t.exports.config = a.config.bind(a);
        t.exports.install = a.install.bind(a);
        t.exports.setDSN = a.setDSN.bind(a);
        t.exports.context = a.context.bind(a);
        t.exports.wrap = a.wrap.bind(a);
        t.exports.uninstall = a.uninstall.bind(a);
        t.exports.capturePageEvent = a.capturePageEvent.bind(a);
        t.exports.captureException = a.captureException.bind(a);
        t.exports.captureMessage = a.captureMessage.bind(a);
        t.exports.captureBreadcrumb = a.captureBreadcrumb.bind(a);
        t.exports.addPlugin = a.addPlugin.bind(a);
        t.exports.setUserContext = a.setUserContext.bind(a);
        t.exports.setExtraContext = a.setExtraContext.bind(a);
        t.exports.setTagsContext = a.setTagsContext.bind(a);
        t.exports.clearContext = a.clearContext.bind(a);
        t.exports.getContext = a.getContext.bind(a);
        t.exports.setEnvironment = a.setEnvironment.bind(a);
        t.exports.setRelease = a.setRelease.bind(a);
        t.exports.setDataCallback = a.setDataCallback.bind(a);
        t.exports.setBreadcrumbCallback = a.setBreadcrumbCallback.bind(a);
        t.exports.setShouldSendCallback = a.setShouldSendCallback.bind(a);
        t.exports.setTransport = a.setTransport.bind(a);
        t.exports.lastException = a.lastException.bind(a);
        t.exports.lastEventId = a.lastEventId.bind(a);
        t.exports.isSetup = a.isSetup.bind(a);
        t.exports.afterLoad = a.afterLoad.bind(a);
        t.exports.showReportDialog = a.showReportDialog.bind(a);
        t.exports = a;
      },
      19: function (t, e, r) {
        'use strict';
        r.r(e);
        r.d(e, {
          Raven: function () {
            return F;
          },
        });
        const i = 5,
          n = 60,
          s = ['name', 'title', 'alt', 'data-test-id', 'data-key'];
        function a(t) {
          const e = [],
            r = ' > ';
          let n = t,
            s = 0;
          for (; n && s < i; ) {
            const t = o(n);
            if ('html' === t) break;
            if (0 === s && '<restricted>' === t) return '<restricted>';
            '<restricted>' !== t && e.push(t);
            s += 1;
            try {
              n = n.parentNode;
            } catch (t) {
              break;
            }
          }
          return e.reverse().join(r);
        }
        function o(t) {
          const e = [];
          if (!t) return '';
          try {
            if (!t.tagName) return '';
            e.push(t.tagName.toLowerCase());
          } catch (t) {
            return '<restricted>';
          }
          try {
            t.id && e.push(`#${t.id}`);
          } catch (t) {}
          for (const r of s)
            try {
              const i = t.getAttribute(r);
              i && e.push(`[${r}="${i}"]`);
            } catch (t) {}
          let r = 0;
          try {
            for (const i of t.classList)
              if (!i.startsWith('private-')) {
                if (r + i.length > n) break;
                r += i.length;
                e.push(`.${i}`);
              }
          } catch (t) {}
          return e.join('');
        }
        var c = r(20),
          u = r(21),
          l = r(22),
          p = r(23),
          { getCorrelationIdFromResponse: h, getCorrelationIdFromXHR: f } = r(24),
          d = r(20),
          m = d.isError,
          g = d.isObject,
          _ = ((g = d.isObject), d.isErrorEvent),
          v = d.isUndefined,
          b = d.isFunction,
          y = d.isString,
          E = d.isEmptyObject,
          w = d.each,
          S = d.objectMerge,
          x = d.truncate,
          k = d.hasKey,
          I = d.joinRegExp,
          O = d.urlencode,
          C = d.uuid4,
          R = d.isSameException,
          D = d.isSameStacktrace,
          z = d.parseUrl,
          L = d.fill,
          q = r(25).wrapMethod,
          j = 'source protocol user pass host port path'.split(' '),
          M = /^(?:(\w+):)?\/\/(?:(\w+)(:\w+)?@)?([\w\.-]+)(?::(\d+))?(\/.*)/;
        function N() {
          return +new Date();
        }
        var T =
            'undefined' != typeof window
              ? window
              : void 0 !== r.g
                ? r.g
                : 'undefined' != typeof self
                  ? self
                  : {},
          U = T.document,
          A = T.navigator;
        function P(t, e) {
          return b(e)
            ? function (r) {
                return e(r, t);
              }
            : e;
        }
        function F() {
          this._hasJSON = !('object' != typeof JSON || !JSON.stringify);
          this._hasDocument = !v(U);
          this._hasNavigator = !v(A);
          this._lastCapturedException = null;
          this._lastData = null;
          this._lastEventId = null;
          this._globalServer = null;
          this._globalKey = null;
          this._globalProject = null;
          this._globalContext = {};
          this._globalOptions = {
            logger: 'javascript',
            ignoreErrors: [],
            ignoreUrls: [],
            whitelistUrls: [],
            includePaths: [],
            collectWindowErrors: !0,
            maxMessageLength: 0,
            maxUrlLength: 250,
            stackTraceLimit: 50,
            autoBreadcrumbs: !0,
            instrument: !0,
            sampleRate: 1,
            chirpErrorEnhancement: {
              enabled: !0,
              extractServiceInfo: !0,
              enhanceErrorMessages: !0,
              includeCallStack: !0,
              maxNestingDepth: 5,
            },
          };
          this._ignoreOnError = 0;
          this._isRavenInstalled = !1;
          this._originalErrorStackTraceLimit = Error.stackTraceLimit;
          this._originalConsole = T.console || {};
          this._originalConsoleMethods = {};
          this._plugins = [];
          this._startTime = N();
          this._wrappedBuiltIns = [];
          this._breadcrumbs = [];
          this._lastCapturedEvent = null;
          this._keypressTimeout;
          this._location = T.location;
          this._lastHref = this._location && this._location.href;
          this._resetBackoff();
          for (var t in this._originalConsole)
            this._originalConsoleMethods[t] = this._originalConsole[t];
        }
        F.prototype = {
          VERSION: '3.19.1',
          debug: !1,
          TraceKit: u,
          config: function (t, e) {
            var r = this;
            if (r._globalServer) {
              this._logDebug('error', 'Error: Raven has already been configured');
              return r;
            }
            if (!t) return r;
            var i = r._globalOptions;
            e &&
              w(e, function (t, e) {
                'tags' === t || 'extra' === t || 'user' === t
                  ? (r._globalContext[t] = e)
                  : (i[t] = e);
              });
            r.setDSN(t);
            i.ignoreErrors.push(/^Script error\.?$/);
            i.ignoreErrors.push(/^Javascript error: Script error\.? on line 0$/);
            i.ignoreErrors = I(i.ignoreErrors);
            i.ignoreUrls = !!i.ignoreUrls.length && I(i.ignoreUrls);
            i.whitelistUrls = !!i.whitelistUrls.length && I(i.whitelistUrls);
            i.includePaths = I(i.includePaths);
            i.maxBreadcrumbs = Math.max(0, Math.min(i.maxBreadcrumbs || 100, 100));
            var n = { xhr: !0, console: !0, dom: !0, location: !0 },
              s = i.autoBreadcrumbs;
            '[object Object]' === {}.toString.call(s) ? (s = S(n, s)) : !1 !== s && (s = n);
            i.autoBreadcrumbs = s;
            var a = { tryCatch: !0 },
              o = i.instrument;
            '[object Object]' === {}.toString.call(o) ? (o = S(a, o)) : !1 !== o && (o = a);
            i.instrument = o;
            u.collectWindowErrors = !!i.collectWindowErrors;
            return r;
          },
          install: function () {
            var t = this;
            if (t.isSetup() && !t._isRavenInstalled) {
              u.report.subscribe(function () {
                t._handleOnErrorStackInfo.apply(t, arguments);
              });
              t._globalOptions.instrument &&
                t._globalOptions.instrument.tryCatch &&
                t._instrumentTryCatch();
              t._globalOptions.autoBreadcrumbs && t._instrumentBreadcrumbs();
              t._drainPlugins();
              t._isRavenInstalled = !0;
            }
            Error.stackTraceLimit = t._globalOptions.stackTraceLimit;
            return this;
          },
          setDSN: function (t) {
            var e = this,
              r = e._parseDSN(t),
              i = r.path.lastIndexOf('/'),
              n = r.path.substr(1, i);
            e._dsn = t;
            e._globalKey = r.user;
            e._globalSecret = r.pass && r.pass.substr(1);
            e._globalProject = r.path.substr(i + 1);
            e._globalServer = e._getGlobalServer(r);
            e._globalEndpoint = e._globalServer + '/' + n + 'api/' + e._globalProject + '/store/';
            e._globalPageEventEndpoint =
              e._globalServer + '/frontend/observability/page-tracking/store/';
            this._resetBackoff();
          },
          context: function (t, e, r) {
            if (b(t)) {
              r = e || [];
              e = t;
              t = void 0;
            }
            return this.wrap(t, e).apply(this, r);
          },
          wrap: function (t, e, r) {
            var i = this;
            if (v(e) && !b(t)) return t;
            if (b(t)) {
              e = t;
              t = void 0;
            }
            if (!b(e)) return e;
            try {
              if (e.__raven__) return e;
              if (e.__raven_wrapper__) return e.__raven_wrapper__;
            } catch (t) {
              return e;
            }
            const { ravenWrapped: n } = {
              ravenWrapped() {
                var n = [],
                  s = arguments.length,
                  a = !t || (t && !1 !== t.deep);
                r && b(r) && r.apply(this, arguments);
                for (; s--; ) n[s] = a ? i.wrap(t, arguments[s]) : arguments[s];
                try {
                  return e.apply(this, n);
                } catch (e) {
                  i._ignoreNextOnError();
                  i.captureException(e, t);
                  throw e;
                }
              },
            };
            for (var s in e) k(e, s) && (n[s] = e[s]);
            n.prototype = e.prototype;
            e.__raven_wrapper__ = n;
            n.__raven__ = !0;
            n.__inner__ = e;
            return n;
          },
          uninstall: function () {
            u.report.uninstall();
            this._restoreBuiltIns();
            Error.stackTraceLimit = this._originalErrorStackTraceLimit;
            this._isRavenInstalled = !1;
            return this;
          },
          capturePageEvent: function (t, e = {}) {
            this._clearExtraAttribute('errorCauseMessage');
            this._clearExtraAttribute('errorCauseStackFrames');
            const r = { message: t, ...e, level: 'info', isPageEvent: !0 };
            this._send(r);
            return this;
          },
          captureException: function (t, e) {
            var r = this;
            if (!r) {
              console.error(
                'Error: captureException was called without Raven instance. This error will not be sent.\nSee https://product.hubteam.com/docs/observability/docs/errors/raven-usage.html#context for more information.'
              );
              return this;
            }
            r._clearExtraAttribute('errorCauseMessage');
            r._clearExtraAttribute('errorCauseStackFrames');
            var i = !m(t),
              n = !_(t),
              s = _(t) && !t.error;
            if ((i && n) || s)
              return this.captureMessage(t, S({ trimHeadFrames: 1, stacktrace: !0 }, e));
            _(t) && (t = t.error);
            var a = t.cause;
            a && r._processErrorCause(a);
            t.extraData && r.setExtraContext({ ...t.extraData });
            this._globalOptions.chirpErrorEnhancement.enabled &&
              this._isChirpError(t) &&
              this._enhanceChirpError(t);
            this._lastCapturedException = t;
            try {
              var o = u.computeStackTrace(t);
              this._handleStackInfo(o, e);
            } catch (e) {
              if (t !== e) throw e;
            }
            return this;
          },
          captureMessage: function (t, e) {
            var r = this;
            r._clearExtraAttribute('errorCauseMessage');
            r._clearExtraAttribute('errorCauseStackFrames');
            if (this._globalOptions.ignoreErrors.test && this._globalOptions.ignoreErrors.test(t))
              this._triggerEvent('captureIgnored', { level: (e && e.level) || 'error' });
            else {
              var i,
                n = S({ message: t + '' }, (e = e || {}));
              try {
                throw new Error(t);
              } catch (t) {
                i = t;
              }
              i.name = null;
              var s = u.computeStackTrace(i),
                a = s.stack[1],
                o = (a && a.url) || '';
              if (
                (!this._globalOptions.ignoreUrls.test || !this._globalOptions.ignoreUrls.test(o)) &&
                (!this._globalOptions.whitelistUrls.test ||
                  this._globalOptions.whitelistUrls.test(o))
              ) {
                if (this._globalOptions.stacktrace || (e && e.stacktrace)) {
                  e = { fingerprint: t, ...e, trimHeadFrames: (e.trimHeadFrames || 0) + 1 };
                  var c = this._prepareFrames(s, e);
                  n.stacktrace = { frames: c.reverse() };
                }
                this._send(n);
                return this;
              }
            }
          },
          captureBreadcrumb: function (t) {
            var e = S({ timestamp: N() / 1e3 }, t);
            if (b(this._globalOptions.breadcrumbCallback)) {
              var r = this._globalOptions.breadcrumbCallback(e);
              if (g(r) && !E(r)) e = r;
              else if (!1 === r) return this;
            }
            this._breadcrumbs.push(e);
            this._breadcrumbs.length > this._globalOptions.maxBreadcrumbs &&
              this._breadcrumbs.shift();
            return this;
          },
          addPlugin: function (t) {
            var e = [].slice.call(arguments, 1);
            this._plugins.push([t, e]);
            this._isRavenInstalled && this._drainPlugins();
            return this;
          },
          setUserContext: function (t) {
            this._globalContext.user = t;
            return this;
          },
          setExtraContext: function (t) {
            this._mergeContext('extra', t);
            return this;
          },
          setTagsContext: function (t) {
            this._mergeContext('tags', t);
            return this;
          },
          clearContext: function () {
            this._globalContext = {};
            return this;
          },
          getContext: function () {
            return JSON.parse(l(this._globalContext));
          },
          setEnvironment: function (t) {
            this._globalOptions.environment = t;
            return this;
          },
          setRelease: function (t) {
            this._globalOptions.release = t;
            return this;
          },
          setDataCallback: function (t) {
            var e = this._globalOptions.dataCallback;
            this._globalOptions.dataCallback = P(e, t);
            return this;
          },
          setBreadcrumbCallback: function (t) {
            var e = this._globalOptions.breadcrumbCallback;
            this._globalOptions.breadcrumbCallback = P(e, t);
            return this;
          },
          setShouldSendCallback: function (t) {
            var e = this._globalOptions.shouldSendCallback;
            this._globalOptions.shouldSendCallback = P(e, t);
            return this;
          },
          setTransport: function (t) {
            this._globalOptions.transport = t;
            return this;
          },
          lastException: function () {
            return this._lastCapturedException;
          },
          lastEventId: function () {
            return this._lastEventId;
          },
          isSetup: function () {
            if (!this._hasJSON) return !1;
            if (!this._globalServer) {
              this.ravenNotConfiguredError || (this.ravenNotConfiguredError = !0);
              this._logDebug('error', 'Error: Raven has not been configured.');
              return !1;
            }
            return !0;
          },
          afterLoad: function () {
            var t = T.RavenConfig;
            t && this.config(t.dsn, t.config).install();
          },
          showReportDialog: function (t) {
            if (U) {
              var e = (t = t || {}).eventId || this.lastEventId();
              if (!e) throw new p('Missing eventId');
              var r = t.dsn || this._dsn;
              if (!r) throw new p('Missing DSN');
              var i = encodeURIComponent,
                n = '';
              n += '?eventId=' + i(e);
              n += '&dsn=' + i(r);
              var s = t.user || this._globalContext.user;
              if (s) {
                s.name && (n += '&name=' + i(s.name));
                s.email && (n += '&email=' + i(s.email));
              }
              var a = this._getGlobalServer(this._parseDSN(r)),
                o = U.createElement('script');
              o.async = !0;
              o.src = a + '/api/embed/error-page/' + n;
              (U.head || U.body).appendChild(o);
            }
          },
          _processErrorCause: function (t) {
            try {
              var e = this,
                r = u.computeStackTrace(t),
                i = this._prepareFrames(r, {}).map(t => ({
                  file: t.filename,
                  methodName: t.function || '?',
                  lineNumber: t.lineno,
                  column: t.colno,
                }));
              r.message && e.setExtraContext({ errorCauseMessage: r.message });
              i && i.length && e.setExtraContext({ errorCauseStackFrames: JSON.stringify(i) });
            } catch (e) {
              if (t !== e) throw e;
            }
          },
          _isChirpError: function (t) {
            return (
              !!t &&
              ((t.message && t.message.includes && t.message.includes('CHIRP RPC failed')) ||
                this._hasChirpErrorStructure(t) ||
                this._containsChirpErrorInstance(t))
            );
          },
          _hasChirpErrorStructure: function (t) {
            return !(!t.cause || !t.cause.cause);
          },
          _containsChirpErrorInstance: function (t) {
            const e = t.cause && t.cause.cause;
            return !(
              !e ||
              !(
                (e.constructor && 'ChirpError' === e.constructor.name) ||
                (e.constructor && 'ChirpInternalError' === e.constructor.name) ||
                e.type
              )
            );
          },
          _enhanceChirpError: function (t) {
            if (!m(t)) return;
            const e = this._extractChirpContext(t);
            if (e) {
              this.setExtraContext({
                chirpServiceName: e.serviceName,
                chirpMethodName: e.methodName,
                chirpErrorType: e.errorType,
                chirpUserDefinedError: e.userDefinedError,
                chirpInternalErrorType: e.internalErrorType,
                chirpOriginalMessage: e.originalMessage,
                chirpCallStack: e.callStack,
                chirpRequestInfo: e.requestInfo,
              });
              if (this._globalOptions.chirpErrorEnhancement.enhanceErrorMessages)
                try {
                  t.message = this._formatEnhancedChirpMessage(t.message, e);
                } catch (t) {
                  this._logDebug('warn', 'Failed to enhance CHIRP error message:', t);
                }
            }
          },
          _extractChirpContext: function (t) {
            const e = {};
            try {
              if (t.message) {
                const r = t.message.match(/CHIRP RPC failed for (\w+)/);
                r && (e.methodName = r[1]);
              }
              let r = t,
                i = 0;
              const n = this._globalOptions.chirpErrorEnhancement.maxNestingDepth;
              for (; r && i < n && r.cause; ) {
                r = r.cause;
                i++;
              }
              const s = r;
              e.serviceName = this._extractServiceName(t, s);
              if (s && s !== t) {
                e.errorType = s.type || 'UNKNOWN';
                e.originalMessage = s.chirpErrorMessage || s.message;
                if (
                  (s.constructor && 'ChirpError' === s.constructor.name) ||
                  'userDefinedError' === s.type
                ) {
                  e.userDefinedError = s;
                  e.errorType = 'USER_DEFINED';
                } else if (
                  (s.constructor && 'ChirpInternalError' === s.constructor.name) ||
                  'internalError' === s.type
                ) {
                  e.internalErrorType = s.type || (s.internalError && s.internalError.type);
                  e.errorType = 'INTERNAL_ERROR';
                }
                this._globalOptions.chirpErrorEnhancement.includeCallStack &&
                  (e.callStack = t.stack);
              }
            } catch (t) {
              this._logDebug('warn', 'Failed to extract CHIRP context:', t);
            }
            return e;
          },
          _extractServiceName: function (t, e) {
            try {
              const r = t.stack || (t.cause && t.cause.stack);
              if (r) {
                const t = r.match(/\/chirp\/([^\/]+)\//);
                if (t) return t[1];
              }
              return e.serviceName ? e.serviceName : e.service ? e.service : 'UNKNOWN_SERVICE';
            } catch (t) {
              return 'UNKNOWN_SERVICE';
            }
          },
          _formatEnhancedChirpMessage: function (t, e) {
            let r = t;
            e.serviceName &&
              'UNKNOWN_SERVICE' !== e.serviceName &&
              (r += ' [Service: ' + e.serviceName + ']');
            e.methodName && (r += ' [Method: ' + e.methodName + ']');
            e.errorType && 'UNKNOWN' !== e.errorType && (r += ' [Type: ' + e.errorType + ']');
            e.originalMessage &&
              e.originalMessage !== t &&
              (r += ' [Details: ' + e.originalMessage + ']');
            return r;
          },
          _clearExtraAttribute: function (t) {
            var e = this;
            v(e._globalContext.extra) || delete e._globalContext.extra[t];
          },
          _ignoreNextOnError: function () {
            var t = this;
            this._ignoreOnError += 1;
            setTimeout(function () {
              t._ignoreOnError -= 1;
            });
          },
          _triggerEvent: function (t, e) {
            var r, i;
            if (this._hasDocument) {
              e = e || {};
              t = 'raven' + t.substr(0, 1).toUpperCase() + t.substr(1);
              U.createEvent
                ? (r = U.createEvent('HTMLEvents')).initEvent(t, !0, !0)
                : ((r = U.createEventObject()).eventType = t);
              for (i in e) k(e, i) && (r[i] = e[i]);
              if (U.createEvent) U.dispatchEvent(r);
              else
                try {
                  U.fireEvent('on' + r.eventType.toLowerCase(), r);
                } catch (t) {}
            }
          },
          _breadcrumbEventHandler: function (t) {
            var e = this;
            return function (r) {
              e._keypressTimeout = null;
              if (e._lastCapturedEvent !== r) {
                e._lastCapturedEvent = r;
                var i;
                try {
                  i = a(r.target);
                } catch (t) {
                  i = '<unknown>';
                }
                e.captureBreadcrumb({ category: 'ui.' + t, message: i });
              }
            };
          },
          _keypressEventHandler: function () {
            var t = this,
              e = 1e3;
            return function (r) {
              var i;
              try {
                i = r.target;
              } catch (t) {
                return;
              }
              var n = i && i.tagName;
              if (n && ('INPUT' === n || 'TEXTAREA' === n || i.isContentEditable)) {
                var s = t._keypressTimeout;
                s || t._breadcrumbEventHandler('input')(r);
                clearTimeout(s);
                t._keypressTimeout = setTimeout(function () {
                  t._keypressTimeout = null;
                }, e);
              }
            };
          },
          _captureUrlChange: function (t, e) {
            var r = z(this._location.href),
              i = z(e),
              n = z(t);
            this._lastHref = e;
            r.protocol === i.protocol && r.host === i.host && (e = i.relative);
            r.protocol === n.protocol && r.host === n.host && (t = n.relative);
            this.captureBreadcrumb({
              category: 'navigation',
              data: {
                to: (0, c.redactSensitiveUrlParams)(e),
                from: (0, c.redactSensitiveUrlParams)(t),
              },
            });
          },
          _instrumentTryCatch: function () {
            var t = this,
              e = t._wrappedBuiltIns;
            function r(e) {
              return function (r, i) {
                for (var n = new Array(arguments.length), s = 0; s < n.length; ++s)
                  n[s] = arguments[s];
                var a = n[0];
                b(a) && (n[0] = t.wrap(a));
                return e.apply ? e.apply(this, n) : e(n[0], n[1]);
              };
            }
            var i = this._globalOptions.autoBreadcrumbs;
            function n(r) {
              var n = T[r] && T[r].prototype;
              if (n && n.hasOwnProperty && n.hasOwnProperty('addEventListener')) {
                L(
                  n,
                  'addEventListener',
                  function (e) {
                    return function (n, s, a, o) {
                      try {
                        s && s.handleEvent && (s.handleEvent = t.wrap(s.handleEvent));
                      } catch (t) {}
                      var c, u, l;
                      if (i && i.dom && ('EventTarget' === r || 'Node' === r)) {
                        u = t._breadcrumbEventHandler('click');
                        l = t._keypressEventHandler();
                        c = function (t) {
                          if (t) {
                            var e;
                            try {
                              e = t.type;
                            } catch (t) {
                              return;
                            }
                            return 'click' === e ? u(t) : 'keypress' === e ? l(t) : void 0;
                          }
                        };
                      }
                      return e.call(this, n, t.wrap(s, void 0, c), a, o);
                    };
                  },
                  e
                );
                L(
                  n,
                  'removeEventListener',
                  function (t) {
                    return function (e, r, i, n) {
                      try {
                        r = r && (r.__raven_wrapper__ ? r.__raven_wrapper__ : r);
                      } catch (t) {}
                      return t.call(this, e, r, i, n);
                    };
                  },
                  e
                );
              }
            }
            L(T, 'setTimeout', r, e);
            L(T, 'setInterval', r, e);
            T.requestAnimationFrame &&
              L(
                T,
                'requestAnimationFrame',
                function (e) {
                  return function (r) {
                    return e(t.wrap(r));
                  };
                },
                e
              );
            for (
              var s = [
                  'EventTarget',
                  'Window',
                  'Node',
                  'ApplicationCache',
                  'AudioTrackList',
                  'ChannelMergerNode',
                  'CryptoOperation',
                  'EventSource',
                  'FileReader',
                  'HTMLUnknownElement',
                  'IDBDatabase',
                  'IDBRequest',
                  'IDBTransaction',
                  'KeyOperation',
                  'MediaController',
                  'MessagePort',
                  'ModalWindow',
                  'Notification',
                  'SVGElementInstance',
                  'Screen',
                  'TextTrack',
                  'TextTrackCue',
                  'TextTrackList',
                  'WebSocket',
                  'WebSocketWorker',
                  'Worker',
                  'XMLHttpRequest',
                  'XMLHttpRequestEventTarget',
                  'XMLHttpRequestUpload',
                ],
                a = 0;
              a < s.length;
              a++
            )
              n(s[a]);
          },
          _instrumentBreadcrumbs: function () {
            var t = this,
              e = this._globalOptions.autoBreadcrumbs,
              r = t._wrappedBuiltIns;
            function i(e, r) {
              e in r &&
                b(r[e]) &&
                L(r, e, function (e) {
                  return t.wrap(e);
                });
            }
            if (e.xhr && 'XMLHttpRequest' in T) {
              var n = XMLHttpRequest.prototype;
              L(
                n,
                'open',
                function (e) {
                  return function (r, i) {
                    !y(i) ||
                      (t._globalKey && -1 !== i.indexOf(t._globalKey)) ||
                      (this.__raven_xhr = { method: r, url: i, status_code: null });
                    return e.apply(this, arguments);
                  };
                },
                r
              );
              L(
                n,
                'send',
                function (e) {
                  return function (r) {
                    var n = this;
                    function s() {
                      if (n.__raven_xhr && 4 === n.readyState) {
                        try {
                          n.__raven_xhr.status_code = n.status;
                          const t = f(n);
                          t && (n.__raven_xhr.correlationId = t);
                        } catch (t) {}
                        t.captureBreadcrumb({ type: 'http', category: 'xhr', data: n.__raven_xhr });
                      }
                    }
                    for (var a = ['onload', 'onerror', 'onprogress'], o = 0; o < a.length; o++)
                      i(a[o], n);
                    'onreadystatechange' in n && b(n.onreadystatechange)
                      ? L(n, 'onreadystatechange', function (e) {
                          return t.wrap(e, void 0, s);
                        })
                      : (n.onreadystatechange = s);
                    return e.apply(this, arguments);
                  };
                },
                r
              );
            }
            e.xhr &&
              'fetch' in T &&
              L(
                T,
                'fetch',
                function (e) {
                  const { ravenFetchWrapper: r } = {
                    ravenFetchWrapper: function (r, i) {
                      for (var n = new Array(arguments.length), s = 0; s < n.length; ++s)
                        n[s] = arguments[s];
                      var a,
                        o = n[0],
                        c = 'GET';
                      if ('string' == typeof o) a = o;
                      else if ('Request' in T && o instanceof T.Request) {
                        a = o.url;
                        o.method && (c = o.method);
                      } else a = '' + o;
                      n[1] && n[1].method && (c = n[1].method);
                      var u = { method: c, url: a, status_code: null };
                      t.captureBreadcrumb({ type: 'http', category: 'fetch', data: u });
                      return e.apply(this, n).then(function (t) {
                        u.status_code = t.status;
                        const e = h(t);
                        e && (u.correlationId = e);
                        return t;
                      });
                    },
                  };
                  return r;
                },
                r
              );
            if (e.dom && this._hasDocument)
              if (U.addEventListener) {
                U.addEventListener('click', t._breadcrumbEventHandler('click'), !1);
                U.addEventListener('keypress', t._keypressEventHandler(), !1);
              } else {
                U.attachEvent('onclick', t._breadcrumbEventHandler('click'));
                U.attachEvent('onkeypress', t._keypressEventHandler());
              }
            var s = T.chrome,
              a =
                !(s && s.app && s.app.runtime) &&
                T.history &&
                history.pushState &&
                history.replaceState;
            if (e.location && a) {
              var o = T.onpopstate;
              T.onpopstate = function () {
                var e = t._location.href;
                t._captureUrlChange(t._lastHref, e);
                if (o) return o.apply(this, arguments);
              };
              var c = function (e) {
                return function () {
                  var r = arguments.length > 2 ? arguments[2] : void 0;
                  r && t._captureUrlChange(t._lastHref, r + '');
                  return e.apply(this, arguments);
                };
              };
              L(history, 'pushState', c, r);
              L(history, 'replaceState', c, r);
            }
            if (e.console && 'console' in T && console.log) {
              var u = function (e, r) {
                t.captureBreadcrumb({ message: e, level: r.level, category: 'console' });
              };
              w(['debug', 'info', 'warn', 'error', 'log'], function (t, e) {
                q(console, e, u);
              });
            }
          },
          _restoreBuiltIns: function () {
            for (var t; this._wrappedBuiltIns.length; ) {
              var e = (t = this._wrappedBuiltIns.shift())[0],
                r = t[1],
                i = t[2];
              e[r] = i;
            }
          },
          _drainPlugins: function () {
            var t = this;
            w(this._plugins, function (e, r) {
              var i = r[0],
                n = r[1];
              i.apply(t, [t].concat(n));
            });
          },
          _parseDSN: function (t) {
            var e = M.exec(t),
              r = {},
              i = 7;
            try {
              for (; i--; ) r[j[i]] = e[i] || '';
            } catch (e) {
              throw new p('Invalid DSN: ' + t);
            }
            if (r.pass && !this._globalOptions.allowSecretKey)
              throw new p(
                'Do not specify your secret key in the DSN. See: http://bit.ly/raven-secret-key'
              );
            return r;
          },
          _getGlobalServer: function (t) {
            var e = t.host,
              r = this._globalContext.tags,
              i = (r && r.hublet) || 'na1',
              n = this._globalOptions.environment || 'prod';
            if ('exceptions.hubspot.com' === t.host) {
              e = `exceptions${'na1' === i ? '' : `-${i}`}.hubspot${'prod' === n ? '' : `${n}`}.com`;
            }
            var s = '//' + e + (t.port ? ':' + t.port : '');
            t.protocol && (s = t.protocol + ':' + s);
            return s;
          },
          _handleOnErrorStackInfo: function () {
            this._ignoreOnError || this._handleStackInfo.apply(this, arguments);
          },
          _handleStackInfo: function (t, e) {
            var r = this._prepareFrames(t, e);
            this._triggerEvent('handle', { stackInfo: t, options: e });
            this._processException(t.name, t.message, t.url, t.lineno, r, e);
          },
          _prepareFrames: function (t, e) {
            var r = this,
              i = [];
            if (t.stack && t.stack.length) {
              w(t.stack, function (e, n) {
                var s = r._normalizeFrame(n, t.url);
                s && i.push(s);
              });
              if (e && e.trimHeadFrames)
                for (var n = 0; n < e.trimHeadFrames && n < i.length; n++) i[n].in_app = !1;
              if (i.some(t => t.function.includes('ravenWrapped')))
                for (var s = i.length - 1; s >= 0; s--) {
                  if (i[s].function.includes('ravenWrapped')) {
                    i[s].in_app = !1;
                    break;
                  }
                  i[s].in_app = !1;
                }
              for (var a = 0; a < i.length; a++)
                i[a].function.includes('ravenFetchWrapper') && (i[a].in_app = !1);
            }
            return (i = i.slice(0, this._globalOptions.stackTraceLimit));
          },
          _normalizeFrame: function (t, e) {
            var r = { filename: t.url, lineno: t.line, colno: t.column, function: t.func || '?' };
            t.url || (r.filename = e);
            r.in_app = !(
              (this._globalOptions.includePaths.test &&
                !this._globalOptions.includePaths.test(r.filename)) ||
              /(Raven|TraceKit)\./.test(r.function)
            );
            return r;
          },
          _processException: function (t, e, r, i, n, s) {
            var a = (t ? t + ': ' : '') + (e || '');
            let o =
              (this._lastCapturedException &&
                this._lastCapturedException.cause &&
                this._lastCapturedException.cause.message) ||
              '';
            if (
              this._globalOptions.ignoreErrors.test &&
              (this._globalOptions.ignoreErrors.test(e) ||
                this._globalOptions.ignoreErrors.test(a) ||
                this._globalOptions.ignoreErrors.test(o))
            )
              this._triggerEvent('captureIgnored', { level: (s && s.level) || 'error' });
            else {
              var c;
              if (n && n.length) {
                r = n[0].filename || r;
                n.reverse();
                c = { frames: n };
              } else r && (c = { frames: [{ filename: r, lineno: i, in_app: !0 }] });
              if (
                (!this._globalOptions.ignoreUrls.test || !this._globalOptions.ignoreUrls.test(r)) &&
                (!this._globalOptions.whitelistUrls.test ||
                  this._globalOptions.whitelistUrls.test(r))
              ) {
                var u = S(
                  { exception: { values: [{ type: t, value: e, stacktrace: c }] }, culprit: r },
                  s
                );
                this._send(u);
              }
            }
          },
          _trimPacket: function (t) {
            var e = this._globalOptions.maxMessageLength;
            t.message && (t.message = x(t.message, e));
            if (t.exception) {
              var r = t.exception.values[0];
              r.value = x(r.value, e);
            }
            var i = t.request;
            if (i) {
              i.url &&
                (i.url = (0, c.redactSensitiveUrlParams)(
                  x(i.url, this._globalOptions.maxUrlLength)
                ));
              i.Referer &&
                (i.Referer = (0, c.redactSensitiveUrlParams)(
                  x(i.Referer, this._globalOptions.maxUrlLength)
                ));
            }
            return t;
          },
          _getHttpData: function () {
            if (this._hasNavigator || this._hasDocument) {
              var t = {};
              this._hasNavigator &&
                A.userAgent &&
                (t.headers = { 'User-Agent': navigator.userAgent });
              if (this._hasDocument) {
                U.location &&
                  U.location.href &&
                  (t.url = (0, c.redactSensitiveUrlParams)(U.location.href));
                if (U.referrer) {
                  t.headers || (t.headers = {});
                  t.headers.Referer = (0, c.redactSensitiveUrlParams)(U.referrer);
                }
              }
              return t;
            }
          },
          _resetBackoff: function () {
            this._backoffDuration = 0;
            this._backoffStart = null;
          },
          _shouldBackoff: function () {
            return this._backoffDuration && N() - this._backoffStart < this._backoffDuration;
          },
          _isRepeatData: function (t) {
            if (t.isPageEvent) return !1;
            var e = this._lastData;
            return (
              !(!e || t.message !== e.message || t.culprit !== e.culprit) &&
              (t.stacktrace || e.stacktrace
                ? D(t.stacktrace, e.stacktrace)
                : (!t.exception && !e.exception) || R(t.exception, e.exception))
            );
          },
          _setBackoffState: function (t) {
            if (!this._shouldBackoff()) {
              var e = t.status;
              if (400 === e || 401 === e || 429 === e) {
                var r;
                try {
                  r = t.getResponseHeader('Retry-After');
                  r = 1e3 * parseInt(r, 10);
                } catch (t) {}
                this._backoffDuration = r || 2 * this._backoffDuration || 1e3;
                this._backoffStart = N();
              }
            }
          },
          _getRecentFailedNetworkRequest: function () {
            if (this._breadcrumbs && this._breadcrumbs.length > 0)
              for (var t = this._breadcrumbs.slice(-10), e = t.length - 1; e >= 0; e--) {
                var r = t[e];
                if (
                  'http' === r.type &&
                  ('xhr' === r.category || 'fetch' === r.category) &&
                  r.data &&
                  r.data.status_code &&
                  r.data.correlationId &&
                  r.data.status_code >= 400
                )
                  return r.data;
              }
            return null;
          },
          _send: function (t) {
            var e = this._globalOptions,
              r = { project: this._globalProject, logger: e.logger, platform: 'javascript' },
              i = this._getHttpData();
            i && (r.request = i);
            t.trimHeadFrames && delete t.trimHeadFrames;
            (t = S(r, t)).tags = S(S({}, this._globalContext.tags || {}), t.tags || {});
            t.extra = S(S({}, this._globalContext.extra || {}), t.extra || {});
            t.extra || (t.extra = {});
            t.extra['session:duration'] = N() - this._startTime;
            t.extra.sessionId = T.hubspot && T.hubspot.sessionId;
            try {
              if (T.localStorage) {
                var n = T.localStorage.getItem('__hmpl');
                if (n) {
                  var s = JSON.parse(n);
                  s && s.session_id && (t.extra.amplitudeSessionId = s.session_id);
                }
              }
            } catch (t) {}
            if (!t.isPageEvent && this._breadcrumbs && this._breadcrumbs.length > 0) {
              var a = this._getRecentFailedNetworkRequest();
              a && a.correlationId && (t.extra.correlationId = a.correlationId);
            }
            !t.isPageEvent &&
              this._breadcrumbs &&
              this._breadcrumbs.length > 0 &&
              (t.breadcrumbs = { values: [].slice.call(this._breadcrumbs, 0) });
            E(t.tags) && delete t.tags;
            this._globalContext.user && (t.user = this._globalContext.user);
            e.environment && (t.environment = e.environment);
            e.release && (t.release = e.release);
            e.serverName && (t.server_name = e.serverName);
            b(e.dataCallback) && (t = e.dataCallback(t) || t);
            t &&
              !E(t) &&
              ((b(e.shouldSendCallback) && !e.shouldSendCallback(t)) ||
                (this._shouldBackoff()
                  ? this._logDebug('warn', 'Raven dropped error due to backoff: ', t)
                  : 'number' == typeof e.sampleRate
                    ? Math.random() < e.sampleRate && this._sendProcessedPayload(t)
                    : this._sendProcessedPayload(t)));
          },
          _getUuid: function () {
            return C();
          },
          _sendProcessedPayload: function (t, e) {
            var r = this,
              i = this._globalOptions;
            if (this.isSetup()) {
              t = this._trimPacket(t);
              if (this._globalOptions.allowDuplicates || !this._isRepeatData(t)) {
                this._lastEventId = t.event_id || (t.event_id = this._getUuid());
                this._lastData = t;
                this._logDebug('debug', 'Raven about to send:', t);
                var n = { sentry_version: '7', sentry_client: 'raven-js/' + this.VERSION };
                this._globalKey && (n.sentry_key = this._globalKey);
                this._globalSecret && (n.sentry_secret = this._globalSecret);
                var s = {},
                  a = t.tags && t.tags.project,
                  o = a;
                a && (s.deployable = t.tags.project);
                var c = t.exception && t.exception.values[0];
                this.captureBreadcrumb({
                  category: t.isPageEvent ? 'pageEvent' : 'sentry',
                  message: c ? (c.type ? c.type + ': ' : '') + c.value : t.message,
                  data: t.isPageEvent ? t.extra : void 0,
                  event_id: t.event_id,
                  level: t.level || 'error',
                });
                var u = t.isPageEvent ? this._globalPageEventEndpoint : this._globalEndpoint;
                (i.transport || this._makeRequest).call(this, {
                  url: u,
                  auth: n,
                  query: o ? s : void 0,
                  data: t,
                  options: i,
                  onSuccess: function () {
                    r._resetBackoff();
                    r._triggerEvent('success', { data: t, src: u });
                    e && e();
                  },
                  onError: function (i) {
                    r._logDebug('error', 'Raven transport failed to send: ', i);
                    i.request && r._setBackoffState(i.request);
                    r._triggerEvent('failure', { data: t, src: u, error: i });
                    i = i || new Error('Raven send failed (no additional details provided)');
                    e && e(i);
                  },
                });
              } else this._logDebug('warn', 'Raven dropped repeat event: ', t);
            }
          },
          _makeRequest: function (t) {
            var e = T.XMLHttpRequest && new T.XMLHttpRequest();
            if (e) {
              if ('withCredentials' in e || 'undefined' != typeof XDomainRequest) {
                var r = t.url;
                if ('withCredentials' in e)
                  e.onreadystatechange = function () {
                    if (4 === e.readyState)
                      if (200 === e.status) t.onSuccess && t.onSuccess();
                      else if (t.onError) {
                        var r = new Error('Sentry error code: ' + e.status);
                        r.request = e;
                        t.onError(r);
                      }
                  };
                else {
                  e = new XDomainRequest();
                  r = r.replace(/^https?:/, '');
                  t.onSuccess && (e.onload = t.onSuccess);
                  t.onError &&
                    (e.onerror = function () {
                      var r = new Error('Sentry error code: XDomainRequest');
                      r.request = e;
                      t.onError(r);
                    });
                }
                try {
                  e.open('POST', `${r}?${O(t.auth)}${t.query ? `&${O(t.query)}` : ''}`);
                  e.send(l(t.data));
                } catch (r) {
                  if (t.onError) {
                    var i = new Error('XMLHttpRequest failed: ' + r.message);
                    i.request = e;
                    i.originalError = r;
                    t.onError(i);
                  }
                }
              }
            }
          },
          _logDebug: function (t) {
            this._originalConsoleMethods[t] &&
              this.debug &&
              Function.prototype.apply.call(
                this._originalConsoleMethods[t],
                this._originalConsole,
                [].slice.call(arguments, 1)
              );
          },
          _mergeContext: function (t, e) {
            v(e)
              ? delete this._globalContext[t]
              : (this._globalContext[t] = S(this._globalContext[t] || {}, e));
          },
        };
        F.prototype.setUser = F.prototype.setUserContext;
        F.prototype.setReleaseContext = F.prototype.setRelease;
      },
      20: function (t, e, r) {
        var i =
          'undefined' != typeof window
            ? window
            : void 0 !== r.g
              ? r.g
              : 'undefined' != typeof self
                ? self
                : {};
        function n(t) {
          return 'object' == typeof t && null !== t;
        }
        function s(t) {
          switch ({}.toString.call(t)) {
            case '[object Error]':
            case '[object Exception]':
            case '[object DOMException]':
              return !0;
            default:
              return t instanceof Error;
          }
        }
        function a(t) {
          return p() && '[object ErrorEvent]' === {}.toString.call(t);
        }
        function o(t) {
          return void 0 === t;
        }
        function c(t) {
          return 'function' == typeof t;
        }
        function u(t) {
          return '[object String]' === Object.prototype.toString.call(t);
        }
        function l(t) {
          for (var e in t) return !1;
          return !0;
        }
        function p() {
          try {
            new ErrorEvent('');
            return !0;
          } catch (t) {
            return !1;
          }
        }
        function h(t) {
          function e(e, r) {
            var i = t(e) || e;
            return (r && r(i)) || i;
          }
          return e;
        }
        function f(t, e) {
          var r, i;
          if (o(t.length)) for (r in t) _(t, r) && e.call(null, r, t[r]);
          else if ((i = t.length)) for (r = 0; r < i; r++) e.call(null, r, t[r]);
        }
        function d(t, e) {
          if (!e) return t;
          f(e, function (e, r) {
            t[e] = r;
          });
          return t;
        }
        function m(t) {
          return !!Object.isFrozen && Object.isFrozen(t);
        }
        function g(t, e) {
          return !e || t.length <= e ? t : t.substr(0, e) + '\u2026';
        }
        function _(t, e) {
          return Object.prototype.hasOwnProperty.call(t, e);
        }
        function v(t) {
          for (var e, r = [], i = 0, n = t.length; i < n; i++)
            u((e = t[i]))
              ? r.push(e.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, '\\$1'))
              : e && e.source && r.push(e.source);
          return new RegExp(r.join('|'), 'i');
        }
        function b(t) {
          var e = [];
          f(t, function (t, r) {
            e.push(encodeURIComponent(t) + '=' + encodeURIComponent(r));
          });
          return e.join('&');
        }
        function y(t) {
          var e = t.match(/^(([^:\/?#]+):)?(\/\/([^\/?#]*))?([^?#]*)(\?([^#]*))?(#(.*))?$/);
          if (!e) return {};
          var r = e[6] || '',
            i = e[8] || '';
          return { protocol: e[2], host: e[4], path: e[5], relative: e[5] + r + i };
        }
        function E() {
          var t = i.crypto || i.msCrypto;
          if (!o(t) && t.getRandomValues) {
            var e = new Uint16Array(8);
            t.getRandomValues(e);
            e[3] = (4095 & e[3]) | 16384;
            e[4] = (16383 & e[4]) | 32768;
            var r = function (t) {
              for (var e = t.toString(16); e.length < 4; ) e = '0' + e;
              return e;
            };
            return r(e[0]) + r(e[1]) + r(e[2]) + r(e[3]) + r(e[4]) + r(e[5]) + r(e[6]) + r(e[7]);
          }
          return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (t) {
            var e = (16 * Math.random()) | 0;
            return ('x' === t ? e : (3 & e) | 8).toString(16);
          });
        }
        function w(t, e) {
          return !!(!!t ^ !!e);
        }
        function S(t, e) {
          if (w(t, e)) return !1;
          t = t.values[0];
          e = e.values[0];
          return t.type === e.type && t.value === e.value && k(t.stacktrace, e.stacktrace);
        }
        function x(t, e) {
          if (t === e) return !0;
          if (null == t && null == e) return !0;
          if (w(t, e)) return !1;
          var r = Object.keys(t),
            i = Object.keys(e);
          if (r.length !== i.length) return !1;
          for (var n = 0; n < r.length; n++) {
            var s = r[n];
            if (!_(e, s)) return !1;
            if (t[s] !== e[s]) return !1;
          }
          return !0;
        }
        function k(t, e) {
          if (null == t && null == e) return !0;
          if (w(t, e)) return !1;
          var r,
            i,
            n = t.frames,
            s = e.frames;
          if (null == n && null == s) return x(t, e);
          if (w(n, s)) return !1;
          if (null == n.length && null == s.length) return x(t, e);
          if (n.length !== s.length) return !1;
          for (var a = 0; a < n.length; a++) {
            r = n[a];
            i = s[a];
            if (
              r.filename !== i.filename ||
              r.lineno !== i.lineno ||
              r.colno !== i.colno ||
              r.function !== i.function
            )
              return !1;
          }
          return !0;
        }
        function I(t, e, r, i) {
          var n = t[e];
          t[e] = r(n);
          i && i.push([t, e, n]);
        }
        function O(t) {
          if (!t || 'string' != typeof t) return t;
          try {
            const e = new URL(t),
              r = e.searchParams;
            r.has('otp') && r.set('otp', '**REDACTED**');
            r.has('otpId') && r.set('otpId', '**REDACTED**');
            if (e.hash) {
              e.hash.substring(1).includes('=') && (e.hash = '**REDACTED**');
            }
            return e.toString();
          } catch (e) {
            return t;
          }
        }
        t.exports = {
          isObject: n,
          isError: s,
          isErrorEvent: a,
          isUndefined: o,
          isFunction: c,
          isString: u,
          isEmptyObject: l,
          supportsErrorEvent: p,
          wrappedCallback: h,
          each: f,
          objectMerge: d,
          truncate: g,
          objectFrozen: m,
          hasKey: _,
          joinRegExp: v,
          urlencode: b,
          uuid4: E,
          isSameObject: x,
          isSameException: S,
          isSameStacktrace: k,
          parseUrl: y,
          fill: I,
          redactSensitiveUrlParams: O,
        };
      },
      21: function (t, e, r) {
        var i = r(20),
          n = { collectWindowErrors: !0, debug: !1 },
          s =
            'undefined' != typeof window
              ? window
              : void 0 !== r.g
                ? r.g
                : 'undefined' != typeof self
                  ? self
                  : {},
          a = [].slice,
          o = '?',
          c =
            /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/;
        function u() {
          return 'undefined' == typeof document || null == document.location
            ? ''
            : document.location.href;
        }
        n.report = (function () {
          var t,
            e,
            r = [],
            l = null,
            p = null,
            h = null;
          function f(t) {
            v();
            r.push(t);
          }
          function d(t) {
            for (var e = r.length - 1; e >= 0; --e) r[e] === t && r.splice(e, 1);
          }
          function m() {
            b();
            r = [];
          }
          function g(t, e) {
            var i = null;
            if (!e || n.collectWindowErrors) {
              for (var s in r)
                if (r.hasOwnProperty(s))
                  try {
                    r[s].apply(null, [t].concat(a.call(arguments, 2)));
                  } catch (t) {
                    i = t;
                  }
              if (i) throw i;
            }
          }
          function _(e, r, s, a, l) {
            if (h) {
              n.computeStackTrace.augmentStackTraceWithInitialElement(h, r, s, e);
              y();
            } else if (l && i.isError(l)) g(n.computeStackTrace(l), !0);
            else {
              var p = { url: r, line: s, column: a },
                f = void 0,
                d = e;
              if ('[object String]' === {}.toString.call(e)) {
                var m;
                if ((m = e.match(c))) {
                  f = m[1];
                  d = m[2];
                }
              }
              p.func = o;
              g({ name: f, message: d, url: u(), stack: [p] }, !0);
            }
            try {
              if (t) return t.apply(this, arguments);
            } catch (t) {
              if (!t.message || -1 === t.message.indexOf(/permission denied/)) throw t;
            }
            return !1;
          }
          function v() {
            if (!e) {
              t = s.onerror;
              s.onerror = _;
              e = !0;
            }
          }
          function b() {
            if (e) {
              s.onerror = t;
              e = !1;
              t = void 0;
            }
          }
          function y() {
            var t = h,
              e = l;
            l = null;
            h = null;
            p = null;
            g.apply(null, [t, !1].concat(e));
          }
          function E(t, e) {
            var r = a.call(arguments, 1);
            if (h) {
              if (p === t) return;
              y();
            }
            var i = n.computeStackTrace(t);
            h = i;
            p = t;
            l = r;
            setTimeout(
              function () {
                p === t && y();
              },
              i.incomplete ? 2e3 : 0
            );
            if (!1 !== e) throw t;
          }
          E.subscribe = f;
          E.unsubscribe = d;
          E.uninstall = m;
          return E;
        })();
        n.computeStackTrace = (function () {
          function t(t) {
            if (void 0 !== t.stack && t.stack) {
              for (
                var e,
                  r,
                  i,
                  n =
                    /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|bpm|<anonymous>|[a-z]:|\/).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
                  s =
                    /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|bpm|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i,
                  a =
                    /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|bpm|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i,
                  c = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i,
                  l = /\((\S*)(?::(\d+))(?::(\d+))\)/,
                  p = t.stack.split('\n'),
                  h = [],
                  f = (/^(.*) is undefined$/.exec(t.message), 0),
                  d = p.length;
                f < d;
                ++f
              ) {
                if ((r = n.exec(p[f]))) {
                  var m = r[2] && 0 === r[2].indexOf('native');
                  if (r[2] && 0 === r[2].indexOf('eval') && (e = l.exec(r[2]))) {
                    r[2] = e[1];
                    r[3] = e[2];
                    r[4] = e[3];
                  }
                  i = {
                    url: m ? null : r[2],
                    func: r[1] || o,
                    args: m ? [r[2]] : [],
                    line: r[3] ? +r[3] : null,
                    column: r[4] ? +r[4] : null,
                  };
                } else if ((r = a.exec(p[f])))
                  i = {
                    url: r[2],
                    func: r[1] || o,
                    args: [],
                    line: +r[3],
                    column: r[4] ? +r[4] : null,
                  };
                else {
                  if (!(r = s.exec(p[f]))) continue;
                  if (r[3] && r[3].indexOf(' > eval') > -1 && (e = c.exec(r[3]))) {
                    r[3] = e[1];
                    r[4] = e[2];
                    r[5] = null;
                  } else
                    0 !== f ||
                      r[5] ||
                      void 0 === t.columnNumber ||
                      (h[0].column = t.columnNumber + 1);
                  i = {
                    url: r[3],
                    func: r[1] || o,
                    args: r[2] ? r[2].split(',') : [],
                    line: r[4] ? +r[4] : null,
                    column: r[5] ? +r[5] : null,
                  };
                }
                !i.func && i.line && (i.func = o);
                h.push(i);
              }
              return h.length ? { name: t.name, message: t.message, url: u(), stack: h } : null;
            }
          }
          function e(t, e, r, i) {
            var n = { url: e, line: r };
            if (n.url && n.line) {
              t.incomplete = !1;
              n.func || (n.func = o);
              if (t.stack.length > 0 && t.stack[0].url === n.url) {
                if (t.stack[0].line === n.line) return !1;
                if (!t.stack[0].line && t.stack[0].func === n.func) {
                  t.stack[0].line = n.line;
                  return !1;
                }
              }
              t.stack.unshift(n);
              t.partial = !0;
              return !0;
            }
            t.incomplete = !0;
            return !1;
          }
          function r(t, s) {
            for (
              var a,
                c,
                l = /function\s+([_$a-zA-Z\xA0-\uFFFF][_$a-zA-Z0-9\xA0-\uFFFF]*)?\s*\(/i,
                p = [],
                h = {},
                f = !1,
                d = r.caller;
              d && !f;
              d = d.caller
            )
              if (d !== i && d !== n.report) {
                c = { url: null, func: o, line: null, column: null };
                d.name ? (c.func = d.name) : (a = l.exec(d.toString())) && (c.func = a[1]);
                if (void 0 === c.func)
                  try {
                    c.func = a.input.substring(0, a.input.indexOf('{'));
                  } catch (t) {}
                h['' + d] ? (f = !0) : (h['' + d] = !0);
                p.push(c);
              }
            s && p.splice(0, s);
            var m = { name: t.name, message: t.message, url: u(), stack: p };
            e(m, t.sourceURL || t.fileName, t.line || t.lineNumber, t.message || t.description);
            return m;
          }
          function i(e, i) {
            var s = null;
            i = null == i ? 0 : +i;
            try {
              if ((s = t(e))) return s;
            } catch (t) {
              if (n.debug) throw t;
            }
            try {
              if ((s = r(e, i + 1))) return s;
            } catch (t) {
              if (n.debug) throw t;
            }
            return { name: e.name, message: e.message, url: u() };
          }
          i.augmentStackTraceWithInitialElement = e;
          i.computeStackTraceFromStackProp = t;
          return i;
        })();
        t.exports = n;
      },
      22: function (t, e) {
        (t.exports = i).getSerialize = s;
        function r(t, e) {
          for (var r = 0; r < t.length; ++r) if (t[r] === e) return r;
          return -1;
        }
        function i(t, e, r, i) {
          return JSON.stringify(t, s(e, i), r);
        }
        function n(t) {
          var e = { stack: t.stack, message: t.message, name: t.name };
          for (var r in t) Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
          return e;
        }
        function s(t, e) {
          var i = [],
            s = [];
          null == e &&
            (e = function (t, e) {
              return i[0] === e
                ? '[Circular ~]'
                : '[Circular ~.' + s.slice(0, r(i, e)).join('.') + ']';
            });
          return function (a, o) {
            if (i.length > 0) {
              var c = r(i, this);
              ~c ? i.splice(c + 1) : i.push(this);
              ~c ? s.splice(c, 1 / 0, a) : s.push(a);
              ~r(i, o) && (o = e.call(this, a, o));
            } else i.push(o);
            return null == t ? (o instanceof Error ? n(o) : o) : t.call(this, a, o);
          };
        }
      },
      23: function (t) {
        function e(t) {
          this.name = 'RavenConfigError';
          this.message = t;
        }
        e.prototype = new Error();
        e.prototype.constructor = e;
        t.exports = e;
      },
      24: function (t, e, r) {
        'use strict';
        r.r(e);
        r.d(e, {
          getCorrelationIdFromResponse: function () {
            return s;
          },
          getCorrelationIdFromServerTiming: function () {
            return i;
          },
          getCorrelationIdFromXHR: function () {
            return n;
          },
        });
        function i(t) {
          var e;
          const r = t.split(',').find(t => t.trim().startsWith('hcid;'));
          if (!r) return null;
          const i = r.split(';').find(t => t.trim().startsWith('desc='));
          if (!i) return null;
          const n = null === (e = i.split('=')[1]) || void 0 === e ? void 0 : e.trim();
          return n ? (n.startsWith('"') && n.endsWith('"') ? JSON.parse(n) : n) : null;
        }
        function n(t) {
          const e = t.getAllResponseHeaders().split('\r\n'),
            r = e.find(t => t.toLowerCase().startsWith('x-hubspot-correlation-id'));
          if (r) {
            const t = r.slice(26).trim();
            if (t) return t;
          }
          const n = e.find(t => t.toLowerCase().startsWith('server-timing'));
          return n ? i(n.slice(15)) : null;
        }
        function s(t) {
          var e;
          const r = t.headers.get('x-hubspot-correlation-id');
          if (r) return r;
          const n =
            null ===
              (e = [...t.headers.entries()].find(([t]) => 'server-timing' === t.toLowerCase())) ||
            void 0 === e
              ? void 0
              : e[1];
          return n ? i(n) : null;
        }
      },
      25: function (t) {
        var e = function (t, e, r) {
          var i = t[e],
            n = t;
          if (e in t) {
            var s = 'warn' === e ? 'warning' : e;
            t[e] = function () {
              var t = [].slice.call(arguments),
                a = '' + t.join(' '),
                o = { level: s, logger: 'console', extra: { arguments: t } };
              if ('assert' === e) {
                if (!1 === t[0]) {
                  a = 'Assertion failed: ' + (t.slice(1).join(' ') || 'console.assert');
                  o.extra.arguments = t.slice(1);
                  r && r(a, o);
                }
              } else r && r(a, o);
              i && Function.prototype.apply.call(i, n, t);
            };
          }
        };
        t.exports = { wrapMethod: e };
      },
      75: function (t) {
        ((e = function () {
          'use strict';
          var t = Array.prototype.slice;
          function e(t, e) {
            e && (t.prototype = Object.create(e.prototype));
            t.prototype.constructor = t;
          }
          function r(t) {
            return a(t) ? t : V(t);
          }
          e(i, r);
          function i(t) {
            return o(t) ? t : G(t);
          }
          e(n, r);
          function n(t) {
            return c(t) ? t : J(t);
          }
          e(s, r);
          function s(t) {
            return a(t) && !u(t) ? t : X(t);
          }
          function a(t) {
            return !(!t || !t[p]);
          }
          function o(t) {
            return !(!t || !t[h]);
          }
          function c(t) {
            return !(!t || !t[f]);
          }
          function u(t) {
            return o(t) || c(t);
          }
          function l(t) {
            return !(!t || !t[d]);
          }
          r.isIterable = a;
          r.isKeyed = o;
          r.isIndexed = c;
          r.isAssociative = u;
          r.isOrdered = l;
          r.Keyed = i;
          r.Indexed = n;
          r.Set = s;
          var p = '@@__IMMUTABLE_ITERABLE__@@',
            h = '@@__IMMUTABLE_KEYED__@@',
            f = '@@__IMMUTABLE_INDEXED__@@',
            d = '@@__IMMUTABLE_ORDERED__@@',
            m = 'delete',
            g = 5,
            _ = 1 << g,
            v = _ - 1,
            b = {},
            y = { value: !1 },
            E = { value: !1 };
          function w(t) {
            t.value = !1;
            return t;
          }
          function S(t) {
            t && (t.value = !0);
          }
          function x() {}
          function k(t, e) {
            e = e || 0;
            for (var r = Math.max(0, t.length - e), i = new Array(r), n = 0; n < r; n++)
              i[n] = t[n + e];
            return i;
          }
          function I(t) {
            void 0 === t.size && (t.size = t.__iterate(C));
            return t.size;
          }
          function O(t, e) {
            if ('number' != typeof e) {
              var r = e >>> 0;
              if ('' + r !== e || 4294967295 === r) return NaN;
              e = r;
            }
            return e < 0 ? I(t) + e : e;
          }
          function C() {
            return !0;
          }
          function R(t, e, r) {
            return (
              (0 === t || (void 0 !== r && t <= -r)) && (void 0 === e || (void 0 !== r && e >= r))
            );
          }
          function D(t, e) {
            return L(t, e, 0);
          }
          function z(t, e) {
            return L(t, e, e);
          }
          function L(t, e, r) {
            return void 0 === t
              ? r
              : t < 0
                ? Math.max(0, e + t)
                : void 0 === e
                  ? t
                  : Math.min(e, t);
          }
          var q = 0,
            j = 1,
            M = 2,
            N = 'function' == typeof Symbol && Symbol.iterator,
            T = '@@iterator',
            U = N || T;
          function A(t) {
            this.next = t;
          }
          A.prototype.toString = function () {
            return '[Iterator]';
          };
          A.KEYS = q;
          A.VALUES = j;
          A.ENTRIES = M;
          A.prototype.inspect = A.prototype.toSource = function () {
            return this.toString();
          };
          A.prototype[U] = function () {
            return this;
          };
          function P(t, e, r, i) {
            var n = 0 === t ? e : 1 === t ? r : [e, r];
            i ? (i.value = n) : (i = { value: n, done: !1 });
            return i;
          }
          function F() {
            return { value: void 0, done: !0 };
          }
          function H(t) {
            return !!W(t);
          }
          function B(t) {
            return t && 'function' == typeof t.next;
          }
          function $(t) {
            var e = W(t);
            return e && e.call(t);
          }
          function W(t) {
            var e = t && ((N && t[N]) || t[T]);
            if ('function' == typeof e) return e;
          }
          function K(t) {
            return t && 'number' == typeof t.length;
          }
          e(V, r);
          function V(t) {
            return null == t ? at() : a(t) ? t.toSeq() : ut(t);
          }
          V.of = function () {
            return V(arguments);
          };
          V.prototype.toSeq = function () {
            return this;
          };
          V.prototype.toString = function () {
            return this.__toString('Seq {', '}');
          };
          V.prototype.cacheResult = function () {
            if (!this._cache && this.__iterateUncached) {
              this._cache = this.entrySeq().toArray();
              this.size = this._cache.length;
            }
            return this;
          };
          V.prototype.__iterate = function (t, e) {
            return pt(this, t, e, !0);
          };
          V.prototype.__iterator = function (t, e) {
            return ht(this, t, e, !0);
          };
          e(G, V);
          function G(t) {
            return null == t
              ? at().toKeyedSeq()
              : a(t)
                ? o(t)
                  ? t.toSeq()
                  : t.fromEntrySeq()
                : ot(t);
          }
          G.prototype.toKeyedSeq = function () {
            return this;
          };
          e(J, V);
          function J(t) {
            return null == t ? at() : a(t) ? (o(t) ? t.entrySeq() : t.toIndexedSeq()) : ct(t);
          }
          J.of = function () {
            return J(arguments);
          };
          J.prototype.toIndexedSeq = function () {
            return this;
          };
          J.prototype.toString = function () {
            return this.__toString('Seq [', ']');
          };
          J.prototype.__iterate = function (t, e) {
            return pt(this, t, e, !1);
          };
          J.prototype.__iterator = function (t, e) {
            return ht(this, t, e, !1);
          };
          e(X, V);
          function X(t) {
            return (null == t ? at() : a(t) ? (o(t) ? t.entrySeq() : t) : ct(t)).toSetSeq();
          }
          X.of = function () {
            return X(arguments);
          };
          X.prototype.toSetSeq = function () {
            return this;
          };
          V.isSeq = st;
          V.Keyed = G;
          V.Set = X;
          V.Indexed = J;
          var Y,
            Q,
            Z,
            tt = '@@__IMMUTABLE_SEQ__@@';
          V.prototype[tt] = !0;
          e(et, J);
          function et(t) {
            this._array = t;
            this.size = t.length;
          }
          et.prototype.get = function (t, e) {
            return this.has(t) ? this._array[O(this, t)] : e;
          };
          et.prototype.__iterate = function (t, e) {
            for (var r = this._array, i = r.length - 1, n = 0; n <= i; n++)
              if (!1 === t(r[e ? i - n : n], n, this)) return n + 1;
            return n;
          };
          et.prototype.__iterator = function (t, e) {
            var r = this._array,
              i = r.length - 1,
              n = 0;
            return new A(function () {
              return n > i ? F() : P(t, n, r[e ? i - n++ : n++]);
            });
          };
          e(rt, G);
          function rt(t) {
            var e = Object.keys(t);
            this._object = t;
            this._keys = e;
            this.size = e.length;
          }
          rt.prototype.get = function (t, e) {
            return void 0 === e || this.has(t) ? this._object[t] : e;
          };
          rt.prototype.has = function (t) {
            return this._object.hasOwnProperty(t);
          };
          rt.prototype.__iterate = function (t, e) {
            for (var r = this._object, i = this._keys, n = i.length - 1, s = 0; s <= n; s++) {
              var a = i[e ? n - s : s];
              if (!1 === t(r[a], a, this)) return s + 1;
            }
            return s;
          };
          rt.prototype.__iterator = function (t, e) {
            var r = this._object,
              i = this._keys,
              n = i.length - 1,
              s = 0;
            return new A(function () {
              var a = i[e ? n - s : s];
              return s++ > n ? F() : P(t, a, r[a]);
            });
          };
          rt.prototype[d] = !0;
          e(it, J);
          function it(t) {
            this._iterable = t;
            this.size = t.length || t.size;
          }
          it.prototype.__iterateUncached = function (t, e) {
            if (e) return this.cacheResult().__iterate(t, e);
            var r = $(this._iterable),
              i = 0;
            if (B(r)) for (var n; !(n = r.next()).done && !1 !== t(n.value, i++, this); );
            return i;
          };
          it.prototype.__iteratorUncached = function (t, e) {
            if (e) return this.cacheResult().__iterator(t, e);
            var r = $(this._iterable);
            if (!B(r)) return new A(F);
            var i = 0;
            return new A(function () {
              var e = r.next();
              return e.done ? e : P(t, i++, e.value);
            });
          };
          e(nt, J);
          function nt(t) {
            this._iterator = t;
            this._iteratorCache = [];
          }
          nt.prototype.__iterateUncached = function (t, e) {
            if (e) return this.cacheResult().__iterate(t, e);
            for (var r, i = this._iterator, n = this._iteratorCache, s = 0; s < n.length; )
              if (!1 === t(n[s], s++, this)) return s;
            for (; !(r = i.next()).done; ) {
              var a = r.value;
              n[s] = a;
              if (!1 === t(a, s++, this)) break;
            }
            return s;
          };
          nt.prototype.__iteratorUncached = function (t, e) {
            if (e) return this.cacheResult().__iterator(t, e);
            var r = this._iterator,
              i = this._iteratorCache,
              n = 0;
            return new A(function () {
              if (n >= i.length) {
                var e = r.next();
                if (e.done) return e;
                i[n] = e.value;
              }
              return P(t, n, i[n++]);
            });
          };
          function st(t) {
            return !(!t || !t[tt]);
          }
          function at() {
            return Y || (Y = new et([]));
          }
          function ot(t) {
            var e = Array.isArray(t)
              ? new et(t).fromEntrySeq()
              : B(t)
                ? new nt(t).fromEntrySeq()
                : H(t)
                  ? new it(t).fromEntrySeq()
                  : 'object' == typeof t
                    ? new rt(t)
                    : void 0;
            if (!e)
              throw new TypeError(
                'Expected Array or iterable object of [k, v] entries, or keyed object: ' + t
              );
            return e;
          }
          function ct(t) {
            var e = lt(t);
            if (!e) throw new TypeError('Expected Array or iterable object of values: ' + t);
            return e;
          }
          function ut(t) {
            var e = lt(t) || ('object' == typeof t && new rt(t));
            if (!e)
              throw new TypeError(
                'Expected Array or iterable object of values, or keyed object: ' + t
              );
            return e;
          }
          function lt(t) {
            return K(t) ? new et(t) : B(t) ? new nt(t) : H(t) ? new it(t) : void 0;
          }
          function pt(t, e, r, i) {
            var n = t._cache;
            if (n) {
              for (var s = n.length - 1, a = 0; a <= s; a++) {
                var o = n[r ? s - a : a];
                if (!1 === e(o[1], i ? o[0] : a, t)) return a + 1;
              }
              return a;
            }
            return t.__iterateUncached(e, r);
          }
          function ht(t, e, r, i) {
            var n = t._cache;
            if (n) {
              var s = n.length - 1,
                a = 0;
              return new A(function () {
                var t = n[r ? s - a : a];
                return a++ > s ? F() : P(e, i ? t[0] : a - 1, t[1]);
              });
            }
            return t.__iteratorUncached(e, r);
          }
          function ft(t, e) {
            return e ? dt(e, t, '', { '': t }) : mt(t);
          }
          function dt(t, e, r, i) {
            return Array.isArray(e)
              ? t.call(
                  i,
                  r,
                  J(e).map(function (r, i) {
                    return dt(t, r, i, e);
                  })
                )
              : gt(e)
                ? t.call(
                    i,
                    r,
                    G(e).map(function (r, i) {
                      return dt(t, r, i, e);
                    })
                  )
                : e;
          }
          function mt(t) {
            return Array.isArray(t) ? J(t).map(mt).toList() : gt(t) ? G(t).map(mt).toMap() : t;
          }
          function gt(t) {
            return t && ('function' != typeof t.constructor || 'Object' === t.constructor.name);
          }
          function _t(t, e) {
            if (t === e || (t != t && e != e)) return !0;
            if (!t || !e) return !1;
            if ('function' == typeof t.valueOf && 'function' == typeof e.valueOf) {
              if ((t = t.valueOf()) === (e = e.valueOf()) || (t != t && e != e)) return !0;
              if (!t || !e) return !1;
            }
            return !(
              'function' != typeof t.equals ||
              'function' != typeof e.equals ||
              !t.equals(e)
            );
          }
          function vt(t, e) {
            if (t === e) return !0;
            if (
              !a(e) ||
              (void 0 !== t.size && void 0 !== e.size && t.size !== e.size) ||
              (void 0 !== t.__hash && void 0 !== e.__hash && t.__hash !== e.__hash) ||
              o(t) !== o(e) ||
              c(t) !== c(e) ||
              l(t) !== l(e)
            )
              return !1;
            if (0 === t.size && 0 === e.size) return !0;
            var r = !u(t);
            if (l(t)) {
              var i = t.entries();
              return (
                e.every(function (t, e) {
                  var n = i.next().value;
                  return n && _t(n[1], t) && (r || _t(n[0], e));
                }) && i.next().done
              );
            }
            var n = !1;
            if (void 0 === t.size)
              if (void 0 === e.size) 'function' == typeof t.cacheResult && t.cacheResult();
              else {
                n = !0;
                var s = t;
                t = e;
                e = s;
              }
            var p = !0,
              h = e.__iterate(function (e, i) {
                if (r ? !t.has(e) : n ? !_t(e, t.get(i, b)) : !_t(t.get(i, b), e)) {
                  p = !1;
                  return !1;
                }
              });
            return p && t.size === h;
          }
          e(bt, J);
          function bt(t, e) {
            if (!(this instanceof bt)) return new bt(t, e);
            this._value = t;
            this.size = void 0 === e ? 1 / 0 : Math.max(0, e);
            if (0 === this.size) {
              if (Q) return Q;
              Q = this;
            }
          }
          bt.prototype.toString = function () {
            return 0 === this.size
              ? 'Repeat []'
              : 'Repeat [ ' + this._value + ' ' + this.size + ' times ]';
          };
          bt.prototype.get = function (t, e) {
            return this.has(t) ? this._value : e;
          };
          bt.prototype.includes = function (t) {
            return _t(this._value, t);
          };
          bt.prototype.slice = function (t, e) {
            var r = this.size;
            return R(t, e, r) ? this : new bt(this._value, z(e, r) - D(t, r));
          };
          bt.prototype.reverse = function () {
            return this;
          };
          bt.prototype.indexOf = function (t) {
            return _t(this._value, t) ? 0 : -1;
          };
          bt.prototype.lastIndexOf = function (t) {
            return _t(this._value, t) ? this.size : -1;
          };
          bt.prototype.__iterate = function (t, e) {
            for (var r = 0; r < this.size; r++) if (!1 === t(this._value, r, this)) return r + 1;
            return r;
          };
          bt.prototype.__iterator = function (t, e) {
            var r = this,
              i = 0;
            return new A(function () {
              return i < r.size ? P(t, i++, r._value) : F();
            });
          };
          bt.prototype.equals = function (t) {
            return t instanceof bt ? _t(this._value, t._value) : vt(t);
          };
          function yt(t, e) {
            if (!t) throw new Error(e);
          }
          e(Et, J);
          function Et(t, e, r) {
            if (!(this instanceof Et)) return new Et(t, e, r);
            yt(0 !== r, 'Cannot step a Range by 0');
            t = t || 0;
            void 0 === e && (e = 1 / 0);
            r = void 0 === r ? 1 : Math.abs(r);
            e < t && (r = -r);
            this._start = t;
            this._end = e;
            this._step = r;
            this.size = Math.max(0, Math.ceil((e - t) / r - 1) + 1);
            if (0 === this.size) {
              if (Z) return Z;
              Z = this;
            }
          }
          Et.prototype.toString = function () {
            return 0 === this.size
              ? 'Range []'
              : 'Range [ ' +
                  this._start +
                  '...' +
                  this._end +
                  (1 !== this._step ? ' by ' + this._step : '') +
                  ' ]';
          };
          Et.prototype.get = function (t, e) {
            return this.has(t) ? this._start + O(this, t) * this._step : e;
          };
          Et.prototype.includes = function (t) {
            var e = (t - this._start) / this._step;
            return e >= 0 && e < this.size && e === Math.floor(e);
          };
          Et.prototype.slice = function (t, e) {
            if (R(t, e, this.size)) return this;
            t = D(t, this.size);
            return (e = z(e, this.size)) <= t
              ? new Et(0, 0)
              : new Et(this.get(t, this._end), this.get(e, this._end), this._step);
          };
          Et.prototype.indexOf = function (t) {
            var e = t - this._start;
            if (e % this._step == 0) {
              var r = e / this._step;
              if (r >= 0 && r < this.size) return r;
            }
            return -1;
          };
          Et.prototype.lastIndexOf = function (t) {
            return this.indexOf(t);
          };
          Et.prototype.__iterate = function (t, e) {
            for (
              var r = this.size - 1,
                i = this._step,
                n = e ? this._start + r * i : this._start,
                s = 0;
              s <= r;
              s++
            ) {
              if (!1 === t(n, s, this)) return s + 1;
              n += e ? -i : i;
            }
            return s;
          };
          Et.prototype.__iterator = function (t, e) {
            var r = this.size - 1,
              i = this._step,
              n = e ? this._start + r * i : this._start,
              s = 0;
            return new A(function () {
              var a = n;
              n += e ? -i : i;
              return s > r ? F() : P(t, s++, a);
            });
          };
          Et.prototype.equals = function (t) {
            return t instanceof Et
              ? this._start === t._start && this._end === t._end && this._step === t._step
              : vt(this, t);
          };
          e(wt, r);
          function wt() {
            throw TypeError('Abstract');
          }
          e(St, wt);
          function St() {}
          e(xt, wt);
          function xt() {}
          e(kt, wt);
          function kt() {}
          wt.Keyed = St;
          wt.Indexed = xt;
          wt.Set = kt;
          var It =
            'function' == typeof Math.imul && -2 === Math.imul(4294967295, 2)
              ? Math.imul
              : function (t, e) {
                  var r = 65535 & (t |= 0),
                    i = 65535 & (e |= 0);
                  return (r * i + ((((t >>> 16) * i + r * (e >>> 16)) << 16) >>> 0)) | 0;
                };
          function Ot(t) {
            return ((t >>> 1) & 1073741824) | (3221225471 & t);
          }
          function Ct(t) {
            if (!1 === t || null == t) return 0;
            if ('function' == typeof t.valueOf && (!1 === (t = t.valueOf()) || null == t)) return 0;
            if (!0 === t) return 1;
            var e = typeof t;
            if ('number' === e) {
              if (t != t || t === 1 / 0) return 0;
              var r = 0 | t;
              r !== t && (r ^= 4294967295 * t);
              for (; t > 4294967295; ) r ^= t /= 4294967295;
              return Ot(r);
            }
            if ('string' === e) return t.length > At ? Rt(t) : Dt(t);
            if ('function' == typeof t.hashCode) return t.hashCode();
            if ('object' === e) return zt(t);
            if ('function' == typeof t.toString) return Dt(t.toString());
            throw new Error('Value type ' + e + ' cannot be hashed.');
          }
          function Rt(t) {
            var e = Ht[t];
            if (void 0 === e) {
              e = Dt(t);
              if (Ft === Pt) {
                Ft = 0;
                Ht = {};
              }
              Ft++;
              Ht[t] = e;
            }
            return e;
          }
          function Dt(t) {
            for (var e = 0, r = 0; r < t.length; r++) e = (31 * e + t.charCodeAt(r)) | 0;
            return Ot(e);
          }
          function zt(t) {
            var e;
            if (Nt && void 0 !== (e = Mt.get(t))) return e;
            if (void 0 !== (e = t[Ut])) return e;
            if (!qt) {
              if (void 0 !== (e = t.propertyIsEnumerable && t.propertyIsEnumerable[Ut])) return e;
              if (void 0 !== (e = jt(t))) return e;
            }
            e = ++Tt;
            1073741824 & Tt && (Tt = 0);
            if (Nt) Mt.set(t, e);
            else {
              if (void 0 !== Lt && !1 === Lt(t))
                throw new Error('Non-extensible objects are not allowed as keys.');
              if (qt)
                Object.defineProperty(t, Ut, {
                  enumerable: !1,
                  configurable: !1,
                  writable: !1,
                  value: e,
                });
              else if (
                void 0 !== t.propertyIsEnumerable &&
                t.propertyIsEnumerable === t.constructor.prototype.propertyIsEnumerable
              ) {
                t.propertyIsEnumerable = function () {
                  return this.constructor.prototype.propertyIsEnumerable.apply(this, arguments);
                };
                t.propertyIsEnumerable[Ut] = e;
              } else {
                if (void 0 === t.nodeType)
                  throw new Error('Unable to set a non-enumerable property on object.');
                t[Ut] = e;
              }
            }
            return e;
          }
          var Lt = Object.isExtensible,
            qt = (function () {
              try {
                Object.defineProperty({}, '@', {});
                return !0;
              } catch (t) {
                return !1;
              }
            })();
          function jt(t) {
            if (t && t.nodeType > 0)
              switch (t.nodeType) {
                case 1:
                  return t.uniqueID;
                case 9:
                  return t.documentElement && t.documentElement.uniqueID;
              }
          }
          var Mt,
            Nt = 'function' == typeof WeakMap;
          Nt && (Mt = new WeakMap());
          var Tt = 0,
            Ut = '__immutablehash__';
          'function' == typeof Symbol && (Ut = Symbol(Ut));
          var At = 16,
            Pt = 255,
            Ft = 0,
            Ht = {};
          function Bt(t) {
            yt(t !== 1 / 0, 'Cannot perform this action with an infinite size.');
          }
          e($t, St);
          function $t(t) {
            return null == t
              ? ne()
              : Wt(t) && !l(t)
                ? t
                : ne().withMutations(function (e) {
                    var r = i(t);
                    Bt(r.size);
                    r.forEach(function (t, r) {
                      return e.set(r, t);
                    });
                  });
          }
          $t.of = function () {
            var e = t.call(arguments, 0);
            return ne().withMutations(function (t) {
              for (var r = 0; r < e.length; r += 2) {
                if (r + 1 >= e.length) throw new Error('Missing value for key: ' + e[r]);
                t.set(e[r], e[r + 1]);
              }
            });
          };
          $t.prototype.toString = function () {
            return this.__toString('Map {', '}');
          };
          $t.prototype.get = function (t, e) {
            return this._root ? this._root.get(0, void 0, t, e) : e;
          };
          $t.prototype.set = function (t, e) {
            return se(this, t, e);
          };
          $t.prototype.setIn = function (t, e) {
            return this.updateIn(t, b, function () {
              return e;
            });
          };
          $t.prototype.remove = function (t) {
            return se(this, t, b);
          };
          $t.prototype.deleteIn = function (t) {
            return this.updateIn(t, function () {
              return b;
            });
          };
          $t.prototype.update = function (t, e, r) {
            return 1 === arguments.length ? t(this) : this.updateIn([t], e, r);
          };
          $t.prototype.updateIn = function (t, e, r) {
            if (!r) {
              r = e;
              e = void 0;
            }
            var i = ge(this, Er(t), e, r);
            return i === b ? void 0 : i;
          };
          $t.prototype.clear = function () {
            if (0 === this.size) return this;
            if (this.__ownerID) {
              this.size = 0;
              this._root = null;
              this.__hash = void 0;
              this.__altered = !0;
              return this;
            }
            return ne();
          };
          $t.prototype.merge = function () {
            return he(this, void 0, arguments);
          };
          $t.prototype.mergeWith = function (e) {
            return he(this, e, t.call(arguments, 1));
          };
          $t.prototype.mergeIn = function (e) {
            var r = t.call(arguments, 1);
            return this.updateIn(e, ne(), function (t) {
              return 'function' == typeof t.merge ? t.merge.apply(t, r) : r[r.length - 1];
            });
          };
          $t.prototype.mergeDeep = function () {
            return he(this, fe, arguments);
          };
          $t.prototype.mergeDeepWith = function (e) {
            var r = t.call(arguments, 1);
            return he(this, de(e), r);
          };
          $t.prototype.mergeDeepIn = function (e) {
            var r = t.call(arguments, 1);
            return this.updateIn(e, ne(), function (t) {
              return 'function' == typeof t.mergeDeep ? t.mergeDeep.apply(t, r) : r[r.length - 1];
            });
          };
          $t.prototype.sort = function (t) {
            return He(lr(this, t));
          };
          $t.prototype.sortBy = function (t, e) {
            return He(lr(this, e, t));
          };
          $t.prototype.withMutations = function (t) {
            var e = this.asMutable();
            t(e);
            return e.wasAltered() ? e.__ensureOwner(this.__ownerID) : this;
          };
          $t.prototype.asMutable = function () {
            return this.__ownerID ? this : this.__ensureOwner(new x());
          };
          $t.prototype.asImmutable = function () {
            return this.__ensureOwner();
          };
          $t.prototype.wasAltered = function () {
            return this.__altered;
          };
          $t.prototype.__iterator = function (t, e) {
            return new te(this, t, e);
          };
          $t.prototype.__iterate = function (t, e) {
            var r = this,
              i = 0;
            this._root &&
              this._root.iterate(function (e) {
                i++;
                return t(e[1], e[0], r);
              }, e);
            return i;
          };
          $t.prototype.__ensureOwner = function (t) {
            if (t === this.__ownerID) return this;
            if (!t) {
              this.__ownerID = t;
              this.__altered = !1;
              return this;
            }
            return ie(this.size, this._root, t, this.__hash);
          };
          function Wt(t) {
            return !(!t || !t[Vt]);
          }
          $t.isMap = Wt;
          var Kt,
            Vt = '@@__IMMUTABLE_MAP__@@',
            Gt = $t.prototype;
          Gt[Vt] = !0;
          Gt[m] = Gt.remove;
          Gt.removeIn = Gt.deleteIn;
          function Jt(t, e) {
            this.ownerID = t;
            this.entries = e;
          }
          Jt.prototype.get = function (t, e, r, i) {
            for (var n = this.entries, s = 0, a = n.length; s < a; s++)
              if (_t(r, n[s][0])) return n[s][1];
            return i;
          };
          Jt.prototype.update = function (t, e, r, i, n, s, a) {
            for (
              var o = n === b, c = this.entries, u = 0, l = c.length;
              u < l && !_t(i, c[u][0]);
              u++
            );
            var p = u < l;
            if (p ? c[u][1] === n : o) return this;
            S(a);
            (o || !p) && S(s);
            if (!o || 1 !== c.length) {
              if (!p && !o && c.length >= Ee) return ue(t, c, i, n);
              var h = t && t === this.ownerID,
                f = h ? c : k(c);
              p
                ? o
                  ? u === l - 1
                    ? f.pop()
                    : (f[u] = f.pop())
                  : (f[u] = [i, n])
                : f.push([i, n]);
              if (h) {
                this.entries = f;
                return this;
              }
              return new Jt(t, f);
            }
          };
          function Xt(t, e, r) {
            this.ownerID = t;
            this.bitmap = e;
            this.nodes = r;
          }
          Xt.prototype.get = function (t, e, r, i) {
            void 0 === e && (e = Ct(r));
            var n = 1 << ((0 === t ? e : e >>> t) & v),
              s = this.bitmap;
            return 0 == (s & n) ? i : this.nodes[_e(s & (n - 1))].get(t + g, e, r, i);
          };
          Xt.prototype.update = function (t, e, r, i, n, s, a) {
            void 0 === r && (r = Ct(i));
            var o = (0 === e ? r : r >>> e) & v,
              c = 1 << o,
              u = this.bitmap,
              l = 0 != (u & c);
            if (!l && n === b) return this;
            var p = _e(u & (c - 1)),
              h = this.nodes,
              f = l ? h[p] : void 0,
              d = ae(f, t, e + g, r, i, n, s, a);
            if (d === f) return this;
            if (!l && d && h.length >= we) return pe(t, h, u, o, d);
            if (l && !d && 2 === h.length && oe(h[1 ^ p])) return h[1 ^ p];
            if (l && d && 1 === h.length && oe(d)) return d;
            var m = t && t === this.ownerID,
              _ = l ? (d ? u : u ^ c) : u | c,
              y = l ? (d ? ve(h, p, d, m) : ye(h, p, m)) : be(h, p, d, m);
            if (m) {
              this.bitmap = _;
              this.nodes = y;
              return this;
            }
            return new Xt(t, _, y);
          };
          function Yt(t, e, r) {
            this.ownerID = t;
            this.count = e;
            this.nodes = r;
          }
          Yt.prototype.get = function (t, e, r, i) {
            void 0 === e && (e = Ct(r));
            var n = (0 === t ? e : e >>> t) & v,
              s = this.nodes[n];
            return s ? s.get(t + g, e, r, i) : i;
          };
          Yt.prototype.update = function (t, e, r, i, n, s, a) {
            void 0 === r && (r = Ct(i));
            var o = (0 === e ? r : r >>> e) & v,
              c = n === b,
              u = this.nodes,
              l = u[o];
            if (c && !l) return this;
            var p = ae(l, t, e + g, r, i, n, s, a);
            if (p === l) return this;
            var h = this.count;
            if (l) {
              if (!p && --h < Se) return le(t, u, h, o);
            } else h++;
            var f = t && t === this.ownerID,
              d = ve(u, o, p, f);
            if (f) {
              this.count = h;
              this.nodes = d;
              return this;
            }
            return new Yt(t, h, d);
          };
          function Qt(t, e, r) {
            this.ownerID = t;
            this.keyHash = e;
            this.entries = r;
          }
          Qt.prototype.get = function (t, e, r, i) {
            for (var n = this.entries, s = 0, a = n.length; s < a; s++)
              if (_t(r, n[s][0])) return n[s][1];
            return i;
          };
          Qt.prototype.update = function (t, e, r, i, n, s, a) {
            void 0 === r && (r = Ct(i));
            var o = n === b;
            if (r !== this.keyHash) {
              if (o) return this;
              S(a);
              S(s);
              return ce(this, t, e, r, [i, n]);
            }
            for (var c = this.entries, u = 0, l = c.length; u < l && !_t(i, c[u][0]); u++);
            var p = u < l;
            if (p ? c[u][1] === n : o) return this;
            S(a);
            (o || !p) && S(s);
            if (o && 2 === l) return new Zt(t, this.keyHash, c[1 ^ u]);
            var h = t && t === this.ownerID,
              f = h ? c : k(c);
            p ? (o ? (u === l - 1 ? f.pop() : (f[u] = f.pop())) : (f[u] = [i, n])) : f.push([i, n]);
            if (h) {
              this.entries = f;
              return this;
            }
            return new Qt(t, this.keyHash, f);
          };
          function Zt(t, e, r) {
            this.ownerID = t;
            this.keyHash = e;
            this.entry = r;
          }
          Zt.prototype.get = function (t, e, r, i) {
            return _t(r, this.entry[0]) ? this.entry[1] : i;
          };
          Zt.prototype.update = function (t, e, r, i, n, s, a) {
            var o = n === b,
              c = _t(i, this.entry[0]);
            if (c ? n === this.entry[1] : o) return this;
            S(a);
            if (!o) {
              if (c) {
                if (t && t === this.ownerID) {
                  this.entry[1] = n;
                  return this;
                }
                return new Zt(t, this.keyHash, [i, n]);
              }
              S(s);
              return ce(this, t, e, Ct(i), [i, n]);
            }
            S(s);
          };
          Jt.prototype.iterate = Qt.prototype.iterate = function (t, e) {
            for (var r = this.entries, i = 0, n = r.length - 1; i <= n; i++)
              if (!1 === t(r[e ? n - i : i])) return !1;
          };
          Xt.prototype.iterate = Yt.prototype.iterate = function (t, e) {
            for (var r = this.nodes, i = 0, n = r.length - 1; i <= n; i++) {
              var s = r[e ? n - i : i];
              if (s && !1 === s.iterate(t, e)) return !1;
            }
          };
          Zt.prototype.iterate = function (t, e) {
            return t(this.entry);
          };
          e(te, A);
          function te(t, e, r) {
            this._type = e;
            this._reverse = r;
            this._stack = t._root && re(t._root);
          }
          te.prototype.next = function () {
            for (var t = this._type, e = this._stack; e; ) {
              var r,
                i = e.node,
                n = e.index++;
              if (i.entry) {
                if (0 === n) return ee(t, i.entry);
              } else if (i.entries) {
                if (n <= (r = i.entries.length - 1))
                  return ee(t, i.entries[this._reverse ? r - n : n]);
              } else if (n <= (r = i.nodes.length - 1)) {
                var s = i.nodes[this._reverse ? r - n : n];
                if (s) {
                  if (s.entry) return ee(t, s.entry);
                  e = this._stack = re(s, e);
                }
                continue;
              }
              e = this._stack = this._stack.__prev;
            }
            return F();
          };
          function ee(t, e) {
            return P(t, e[0], e[1]);
          }
          function re(t, e) {
            return { node: t, index: 0, __prev: e };
          }
          function ie(t, e, r, i) {
            var n = Object.create(Gt);
            n.size = t;
            n._root = e;
            n.__ownerID = r;
            n.__hash = i;
            n.__altered = !1;
            return n;
          }
          function ne() {
            return Kt || (Kt = ie(0));
          }
          function se(t, e, r) {
            var i, n;
            if (t._root) {
              var s = w(y),
                a = w(E);
              i = ae(t._root, t.__ownerID, 0, void 0, e, r, s, a);
              if (!a.value) return t;
              n = t.size + (s.value ? (r === b ? -1 : 1) : 0);
            } else {
              if (r === b) return t;
              n = 1;
              i = new Jt(t.__ownerID, [[e, r]]);
            }
            if (t.__ownerID) {
              t.size = n;
              t._root = i;
              t.__hash = void 0;
              t.__altered = !0;
              return t;
            }
            return i ? ie(n, i) : ne();
          }
          function ae(t, e, r, i, n, s, a, o) {
            if (!t) {
              if (s === b) return t;
              S(o);
              S(a);
              return new Zt(e, i, [n, s]);
            }
            return t.update(e, r, i, n, s, a, o);
          }
          function oe(t) {
            return t.constructor === Zt || t.constructor === Qt;
          }
          function ce(t, e, r, i, n) {
            if (t.keyHash === i) return new Qt(e, i, [t.entry, n]);
            var s,
              a = (0 === r ? t.keyHash : t.keyHash >>> r) & v,
              o = (0 === r ? i : i >>> r) & v;
            return new Xt(
              e,
              (1 << a) | (1 << o),
              a === o ? [ce(t, e, r + g, i, n)] : ((s = new Zt(e, i, n)), a < o ? [t, s] : [s, t])
            );
          }
          function ue(t, e, r, i) {
            t || (t = new x());
            for (var n = new Zt(t, Ct(r), [r, i]), s = 0; s < e.length; s++) {
              var a = e[s];
              n = n.update(t, 0, void 0, a[0], a[1]);
            }
            return n;
          }
          function le(t, e, r, i) {
            for (
              var n = 0, s = 0, a = new Array(r), o = 0, c = 1, u = e.length;
              o < u;
              o++, c <<= 1
            ) {
              var l = e[o];
              if (void 0 !== l && o !== i) {
                n |= c;
                a[s++] = l;
              }
            }
            return new Xt(t, n, a);
          }
          function pe(t, e, r, i, n) {
            for (var s = 0, a = new Array(_), o = 0; 0 !== r; o++, r >>>= 1)
              a[o] = 1 & r ? e[s++] : void 0;
            a[i] = n;
            return new Yt(t, s + 1, a);
          }
          function he(t, e, r) {
            for (var n = [], s = 0; s < r.length; s++) {
              var o = r[s],
                c = i(o);
              a(o) ||
                (c = c.map(function (t) {
                  return ft(t);
                }));
              n.push(c);
            }
            return me(t, e, n);
          }
          function fe(t, e, r) {
            return t && t.mergeDeep && a(e) ? t.mergeDeep(e) : _t(t, e) ? t : e;
          }
          function de(t) {
            return function (e, r, i) {
              if (e && e.mergeDeepWith && a(r)) return e.mergeDeepWith(t, r);
              var n = t(e, r, i);
              return _t(e, n) ? e : n;
            };
          }
          function me(t, e, r) {
            return 0 ===
              (r = r.filter(function (t) {
                return 0 !== t.size;
              })).length
              ? t
              : 0 !== t.size || t.__ownerID || 1 !== r.length
                ? t.withMutations(function (t) {
                    for (
                      var i = e
                          ? function (r, i) {
                              t.update(i, b, function (t) {
                                return t === b ? r : e(t, r, i);
                              });
                            }
                          : function (e, r) {
                              t.set(r, e);
                            },
                        n = 0;
                      n < r.length;
                      n++
                    )
                      r[n].forEach(i);
                  })
                : t.constructor(r[0]);
          }
          function ge(t, e, r, i) {
            var n = t === b,
              s = e.next();
            if (s.done) {
              var a = n ? r : t,
                o = i(a);
              return o === a ? t : o;
            }
            yt(n || (t && t.set), 'invalid keyPath');
            var c = s.value,
              u = n ? b : t.get(c, b),
              l = ge(u, e, r, i);
            return l === u ? t : l === b ? t.remove(c) : (n ? ne() : t).set(c, l);
          }
          function _e(t) {
            t =
              ((t = (858993459 & (t -= (t >> 1) & 1431655765)) + ((t >> 2) & 858993459)) +
                (t >> 4)) &
              252645135;
            t += t >> 8;
            return 127 & (t += t >> 16);
          }
          function ve(t, e, r, i) {
            var n = i ? t : k(t);
            n[e] = r;
            return n;
          }
          function be(t, e, r, i) {
            var n = t.length + 1;
            if (i && e + 1 === n) {
              t[e] = r;
              return t;
            }
            for (var s = new Array(n), a = 0, o = 0; o < n; o++)
              if (o === e) {
                s[o] = r;
                a = -1;
              } else s[o] = t[o + a];
            return s;
          }
          function ye(t, e, r) {
            var i = t.length - 1;
            if (r && e === i) {
              t.pop();
              return t;
            }
            for (var n = new Array(i), s = 0, a = 0; a < i; a++) {
              a === e && (s = 1);
              n[a] = t[a + s];
            }
            return n;
          }
          var Ee = _ / 4,
            we = _ / 2,
            Se = _ / 4;
          e(xe, xt);
          function xe(t) {
            var e = je();
            if (null == t) return e;
            if (ke(t)) return t;
            var r = n(t),
              i = r.size;
            if (0 === i) return e;
            Bt(i);
            return i > 0 && i < _
              ? qe(0, i, g, null, new Ce(r.toArray()))
              : e.withMutations(function (t) {
                  t.setSize(i);
                  r.forEach(function (e, r) {
                    return t.set(r, e);
                  });
                });
          }
          xe.of = function () {
            return this(arguments);
          };
          xe.prototype.toString = function () {
            return this.__toString('List [', ']');
          };
          xe.prototype.get = function (t, e) {
            if ((t = O(this, t)) >= 0 && t < this.size) {
              var r = Ue(this, (t += this._origin));
              return r && r.array[t & v];
            }
            return e;
          };
          xe.prototype.set = function (t, e) {
            return Me(this, t, e);
          };
          xe.prototype.remove = function (t) {
            return this.has(t)
              ? 0 === t
                ? this.shift()
                : t === this.size - 1
                  ? this.pop()
                  : this.splice(t, 1)
              : this;
          };
          xe.prototype.insert = function (t, e) {
            return this.splice(t, 0, e);
          };
          xe.prototype.clear = function () {
            if (0 === this.size) return this;
            if (this.__ownerID) {
              this.size = this._origin = this._capacity = 0;
              this._level = g;
              this._root = this._tail = null;
              this.__hash = void 0;
              this.__altered = !0;
              return this;
            }
            return je();
          };
          xe.prototype.push = function () {
            var t = arguments,
              e = this.size;
            return this.withMutations(function (r) {
              Ae(r, 0, e + t.length);
              for (var i = 0; i < t.length; i++) r.set(e + i, t[i]);
            });
          };
          xe.prototype.pop = function () {
            return Ae(this, 0, -1);
          };
          xe.prototype.unshift = function () {
            var t = arguments;
            return this.withMutations(function (e) {
              Ae(e, -t.length);
              for (var r = 0; r < t.length; r++) e.set(r, t[r]);
            });
          };
          xe.prototype.shift = function () {
            return Ae(this, 1);
          };
          xe.prototype.merge = function () {
            return Pe(this, void 0, arguments);
          };
          xe.prototype.mergeWith = function (e) {
            return Pe(this, e, t.call(arguments, 1));
          };
          xe.prototype.mergeDeep = function () {
            return Pe(this, fe, arguments);
          };
          xe.prototype.mergeDeepWith = function (e) {
            var r = t.call(arguments, 1);
            return Pe(this, de(e), r);
          };
          xe.prototype.setSize = function (t) {
            return Ae(this, 0, t);
          };
          xe.prototype.slice = function (t, e) {
            var r = this.size;
            return R(t, e, r) ? this : Ae(this, D(t, r), z(e, r));
          };
          xe.prototype.__iterator = function (t, e) {
            var r = 0,
              i = Le(this, e);
            return new A(function () {
              var e = i();
              return e === ze ? F() : P(t, r++, e);
            });
          };
          xe.prototype.__iterate = function (t, e) {
            for (var r, i = 0, n = Le(this, e); (r = n()) !== ze && !1 !== t(r, i++, this); );
            return i;
          };
          xe.prototype.__ensureOwner = function (t) {
            if (t === this.__ownerID) return this;
            if (!t) {
              this.__ownerID = t;
              return this;
            }
            return qe(
              this._origin,
              this._capacity,
              this._level,
              this._root,
              this._tail,
              t,
              this.__hash
            );
          };
          function ke(t) {
            return !(!t || !t[Ie]);
          }
          xe.isList = ke;
          var Ie = '@@__IMMUTABLE_LIST__@@',
            Oe = xe.prototype;
          Oe[Ie] = !0;
          Oe[m] = Oe.remove;
          Oe.setIn = Gt.setIn;
          Oe.deleteIn = Oe.removeIn = Gt.removeIn;
          Oe.update = Gt.update;
          Oe.updateIn = Gt.updateIn;
          Oe.mergeIn = Gt.mergeIn;
          Oe.mergeDeepIn = Gt.mergeDeepIn;
          Oe.withMutations = Gt.withMutations;
          Oe.asMutable = Gt.asMutable;
          Oe.asImmutable = Gt.asImmutable;
          Oe.wasAltered = Gt.wasAltered;
          function Ce(t, e) {
            this.array = t;
            this.ownerID = e;
          }
          Ce.prototype.removeBefore = function (t, e, r) {
            if (r === e ? 1 << e : 0 === this.array.length) return this;
            var i = (r >>> e) & v;
            if (i >= this.array.length) return new Ce([], t);
            var n,
              s = 0 === i;
            if (e > 0) {
              var a = this.array[i];
              if ((n = a && a.removeBefore(t, e - g, r)) === a && s) return this;
            }
            if (s && !n) return this;
            var o = Te(this, t);
            if (!s) for (var c = 0; c < i; c++) o.array[c] = void 0;
            n && (o.array[i] = n);
            return o;
          };
          Ce.prototype.removeAfter = function (t, e, r) {
            if (r === (e ? 1 << e : 0) || 0 === this.array.length) return this;
            var i,
              n = ((r - 1) >>> e) & v;
            if (n >= this.array.length) return this;
            if (e > 0) {
              var s = this.array[n];
              if ((i = s && s.removeAfter(t, e - g, r)) === s && n === this.array.length - 1)
                return this;
            }
            var a = Te(this, t);
            a.array.splice(n + 1);
            i && (a.array[n] = i);
            return a;
          };
          var Re,
            De,
            ze = {};
          function Le(t, e) {
            var r = t._origin,
              i = t._capacity,
              n = Fe(i),
              s = t._tail;
            return a(t._root, t._level, 0);
            function a(t, e, r) {
              return 0 === e ? o(t, r) : c(t, e, r);
            }
            function o(t, a) {
              var o = a === n ? s && s.array : t && t.array,
                c = a > r ? 0 : r - a,
                u = i - a;
              u > _ && (u = _);
              return function () {
                if (c === u) return ze;
                var t = e ? --u : c++;
                return o && o[t];
              };
            }
            function c(t, n, s) {
              var o,
                c = t && t.array,
                u = s > r ? 0 : (r - s) >> n,
                l = 1 + ((i - s) >> n);
              l > _ && (l = _);
              return function () {
                for (;;) {
                  if (o) {
                    var t = o();
                    if (t !== ze) return t;
                    o = null;
                  }
                  if (u === l) return ze;
                  var r = e ? --l : u++;
                  o = a(c && c[r], n - g, s + (r << n));
                }
              };
            }
          }
          function qe(t, e, r, i, n, s, a) {
            var o = Object.create(Oe);
            o.size = e - t;
            o._origin = t;
            o._capacity = e;
            o._level = r;
            o._root = i;
            o._tail = n;
            o.__ownerID = s;
            o.__hash = a;
            o.__altered = !1;
            return o;
          }
          function je() {
            return Re || (Re = qe(0, 0, g));
          }
          function Me(t, e, r) {
            if ((e = O(t, e)) != e) return t;
            if (e >= t.size || e < 0)
              return t.withMutations(function (t) {
                e < 0 ? Ae(t, e).set(0, r) : Ae(t, 0, e + 1).set(e, r);
              });
            e += t._origin;
            var i = t._tail,
              n = t._root,
              s = w(E);
            e >= Fe(t._capacity)
              ? (i = Ne(i, t.__ownerID, 0, e, r, s))
              : (n = Ne(n, t.__ownerID, t._level, e, r, s));
            if (!s.value) return t;
            if (t.__ownerID) {
              t._root = n;
              t._tail = i;
              t.__hash = void 0;
              t.__altered = !0;
              return t;
            }
            return qe(t._origin, t._capacity, t._level, n, i);
          }
          function Ne(t, e, r, i, n, s) {
            var a,
              o = (i >>> r) & v,
              c = t && o < t.array.length;
            if (!c && void 0 === n) return t;
            if (r > 0) {
              var u = t && t.array[o],
                l = Ne(u, e, r - g, i, n, s);
              if (l === u) return t;
              (a = Te(t, e)).array[o] = l;
              return a;
            }
            if (c && t.array[o] === n) return t;
            S(s);
            a = Te(t, e);
            void 0 === n && o === a.array.length - 1 ? a.array.pop() : (a.array[o] = n);
            return a;
          }
          function Te(t, e) {
            return e && t && e === t.ownerID ? t : new Ce(t ? t.array.slice() : [], e);
          }
          function Ue(t, e) {
            if (e >= Fe(t._capacity)) return t._tail;
            if (e < 1 << (t._level + g)) {
              for (var r = t._root, i = t._level; r && i > 0; ) {
                r = r.array[(e >>> i) & v];
                i -= g;
              }
              return r;
            }
          }
          function Ae(t, e, r) {
            void 0 !== e && (e |= 0);
            void 0 !== r && (r |= 0);
            var i = t.__ownerID || new x(),
              n = t._origin,
              s = t._capacity,
              a = n + e,
              o = void 0 === r ? s : r < 0 ? s + r : n + r;
            if (a === n && o === s) return t;
            if (a >= o) return t.clear();
            for (var c = t._level, u = t._root, l = 0; a + l < 0; ) {
              u = new Ce(u && u.array.length ? [void 0, u] : [], i);
              l += 1 << (c += g);
            }
            if (l) {
              a += l;
              n += l;
              o += l;
              s += l;
            }
            for (var p = Fe(s), h = Fe(o); h >= 1 << (c + g); ) {
              u = new Ce(u && u.array.length ? [u] : [], i);
              c += g;
            }
            var f = t._tail,
              d = h < p ? Ue(t, o - 1) : h > p ? new Ce([], i) : f;
            if (f && h > p && a < s && f.array.length) {
              for (var m = (u = Te(u, i)), _ = c; _ > g; _ -= g) {
                var b = (p >>> _) & v;
                m = m.array[b] = Te(m.array[b], i);
              }
              m.array[(p >>> g) & v] = f;
            }
            o < s && (d = d && d.removeAfter(i, 0, o));
            if (a >= h) {
              a -= h;
              o -= h;
              c = g;
              u = null;
              d = d && d.removeBefore(i, 0, a);
            } else if (a > n || h < p) {
              l = 0;
              for (; u; ) {
                var y = (a >>> c) & v;
                if ((y !== h >>> c) & v) break;
                y && (l += (1 << c) * y);
                c -= g;
                u = u.array[y];
              }
              u && a > n && (u = u.removeBefore(i, c, a - l));
              u && h < p && (u = u.removeAfter(i, c, h - l));
              if (l) {
                a -= l;
                o -= l;
              }
            }
            if (t.__ownerID) {
              t.size = o - a;
              t._origin = a;
              t._capacity = o;
              t._level = c;
              t._root = u;
              t._tail = d;
              t.__hash = void 0;
              t.__altered = !0;
              return t;
            }
            return qe(a, o, c, u, d);
          }
          function Pe(t, e, r) {
            for (var i = [], s = 0, o = 0; o < r.length; o++) {
              var c = r[o],
                u = n(c);
              u.size > s && (s = u.size);
              a(c) ||
                (u = u.map(function (t) {
                  return ft(t);
                }));
              i.push(u);
            }
            s > t.size && (t = t.setSize(s));
            return me(t, e, i);
          }
          function Fe(t) {
            return t < _ ? 0 : ((t - 1) >>> g) << g;
          }
          e(He, $t);
          function He(t) {
            return null == t
              ? We()
              : Be(t)
                ? t
                : We().withMutations(function (e) {
                    var r = i(t);
                    Bt(r.size);
                    r.forEach(function (t, r) {
                      return e.set(r, t);
                    });
                  });
          }
          He.of = function () {
            return this(arguments);
          };
          He.prototype.toString = function () {
            return this.__toString('OrderedMap {', '}');
          };
          He.prototype.get = function (t, e) {
            var r = this._map.get(t);
            return void 0 !== r ? this._list.get(r)[1] : e;
          };
          He.prototype.clear = function () {
            if (0 === this.size) return this;
            if (this.__ownerID) {
              this.size = 0;
              this._map.clear();
              this._list.clear();
              return this;
            }
            return We();
          };
          He.prototype.set = function (t, e) {
            return Ke(this, t, e);
          };
          He.prototype.remove = function (t) {
            return Ke(this, t, b);
          };
          He.prototype.wasAltered = function () {
            return this._map.wasAltered() || this._list.wasAltered();
          };
          He.prototype.__iterate = function (t, e) {
            var r = this;
            return this._list.__iterate(function (e) {
              return e && t(e[1], e[0], r);
            }, e);
          };
          He.prototype.__iterator = function (t, e) {
            return this._list.fromEntrySeq().__iterator(t, e);
          };
          He.prototype.__ensureOwner = function (t) {
            if (t === this.__ownerID) return this;
            var e = this._map.__ensureOwner(t),
              r = this._list.__ensureOwner(t);
            if (!t) {
              this.__ownerID = t;
              this._map = e;
              this._list = r;
              return this;
            }
            return $e(e, r, t, this.__hash);
          };
          function Be(t) {
            return Wt(t) && l(t);
          }
          He.isOrderedMap = Be;
          He.prototype[d] = !0;
          He.prototype[m] = He.prototype.remove;
          function $e(t, e, r, i) {
            var n = Object.create(He.prototype);
            n.size = t ? t.size : 0;
            n._map = t;
            n._list = e;
            n.__ownerID = r;
            n.__hash = i;
            return n;
          }
          function We() {
            return De || (De = $e(ne(), je()));
          }
          function Ke(t, e, r) {
            var i,
              n,
              s = t._map,
              a = t._list,
              o = s.get(e),
              c = void 0 !== o;
            if (r === b) {
              if (!c) return t;
              if (a.size >= _ && a.size >= 2 * s.size) {
                i = (n = a.filter(function (t, e) {
                  return void 0 !== t && o !== e;
                }))
                  .toKeyedSeq()
                  .map(function (t) {
                    return t[0];
                  })
                  .flip()
                  .toMap();
                t.__ownerID && (i.__ownerID = n.__ownerID = t.__ownerID);
              } else {
                i = s.remove(e);
                n = o === a.size - 1 ? a.pop() : a.set(o, void 0);
              }
            } else if (c) {
              if (r === a.get(o)[1]) return t;
              i = s;
              n = a.set(o, [e, r]);
            } else {
              i = s.set(e, a.size);
              n = a.set(a.size, [e, r]);
            }
            if (t.__ownerID) {
              t.size = i.size;
              t._map = i;
              t._list = n;
              t.__hash = void 0;
              return t;
            }
            return $e(i, n);
          }
          e(Ve, G);
          function Ve(t, e) {
            this._iter = t;
            this._useKeys = e;
            this.size = t.size;
          }
          Ve.prototype.get = function (t, e) {
            return this._iter.get(t, e);
          };
          Ve.prototype.has = function (t) {
            return this._iter.has(t);
          };
          Ve.prototype.valueSeq = function () {
            return this._iter.valueSeq();
          };
          Ve.prototype.reverse = function () {
            var t = this,
              e = Ze(this, !0);
            this._useKeys ||
              (e.valueSeq = function () {
                return t._iter.toSeq().reverse();
              });
            return e;
          };
          Ve.prototype.map = function (t, e) {
            var r = this,
              i = Qe(this, t, e);
            this._useKeys ||
              (i.valueSeq = function () {
                return r._iter.toSeq().map(t, e);
              });
            return i;
          };
          Ve.prototype.__iterate = function (t, e) {
            var r,
              i = this;
            return this._iter.__iterate(
              this._useKeys
                ? function (e, r) {
                    return t(e, r, i);
                  }
                : ((r = e ? gr(this) : 0),
                  function (n) {
                    return t(n, e ? --r : r++, i);
                  }),
              e
            );
          };
          Ve.prototype.__iterator = function (t, e) {
            if (this._useKeys) return this._iter.__iterator(t, e);
            var r = this._iter.__iterator(j, e),
              i = e ? gr(this) : 0;
            return new A(function () {
              var n = r.next();
              return n.done ? n : P(t, e ? --i : i++, n.value, n);
            });
          };
          Ve.prototype[d] = !0;
          e(Ge, J);
          function Ge(t) {
            this._iter = t;
            this.size = t.size;
          }
          Ge.prototype.includes = function (t) {
            return this._iter.includes(t);
          };
          Ge.prototype.__iterate = function (t, e) {
            var r = this,
              i = 0;
            return this._iter.__iterate(function (e) {
              return t(e, i++, r);
            }, e);
          };
          Ge.prototype.__iterator = function (t, e) {
            var r = this._iter.__iterator(j, e),
              i = 0;
            return new A(function () {
              var e = r.next();
              return e.done ? e : P(t, i++, e.value, e);
            });
          };
          e(Je, X);
          function Je(t) {
            this._iter = t;
            this.size = t.size;
          }
          Je.prototype.has = function (t) {
            return this._iter.includes(t);
          };
          Je.prototype.__iterate = function (t, e) {
            var r = this;
            return this._iter.__iterate(function (e) {
              return t(e, e, r);
            }, e);
          };
          Je.prototype.__iterator = function (t, e) {
            var r = this._iter.__iterator(j, e);
            return new A(function () {
              var e = r.next();
              return e.done ? e : P(t, e.value, e.value, e);
            });
          };
          e(Xe, G);
          function Xe(t) {
            this._iter = t;
            this.size = t.size;
          }
          Xe.prototype.entrySeq = function () {
            return this._iter.toSeq();
          };
          Xe.prototype.__iterate = function (t, e) {
            var r = this;
            return this._iter.__iterate(function (e) {
              if (e) {
                mr(e);
                var i = a(e);
                return t(i ? e.get(1) : e[1], i ? e.get(0) : e[0], r);
              }
            }, e);
          };
          Xe.prototype.__iterator = function (t, e) {
            var r = this._iter.__iterator(j, e);
            return new A(function () {
              for (;;) {
                var e = r.next();
                if (e.done) return e;
                var i = e.value;
                if (i) {
                  mr(i);
                  var n = a(i);
                  return P(t, n ? i.get(0) : i[0], n ? i.get(1) : i[1], e);
                }
              }
            });
          };
          Ge.prototype.cacheResult =
            Ve.prototype.cacheResult =
            Je.prototype.cacheResult =
            Xe.prototype.cacheResult =
              br;
          function Ye(t) {
            var e = vr(t);
            e._iter = t;
            e.size = t.size;
            e.flip = function () {
              return t;
            };
            e.reverse = function () {
              var e = t.reverse.apply(this);
              e.flip = function () {
                return t.reverse();
              };
              return e;
            };
            e.has = function (e) {
              return t.includes(e);
            };
            e.includes = function (e) {
              return t.has(e);
            };
            e.cacheResult = br;
            e.__iterateUncached = function (e, r) {
              var i = this;
              return t.__iterate(function (t, r) {
                return !1 !== e(r, t, i);
              }, r);
            };
            e.__iteratorUncached = function (e, r) {
              if (e === M) {
                var i = t.__iterator(e, r);
                return new A(function () {
                  var t = i.next();
                  if (!t.done) {
                    var e = t.value[0];
                    t.value[0] = t.value[1];
                    t.value[1] = e;
                  }
                  return t;
                });
              }
              return t.__iterator(e === j ? q : j, r);
            };
            return e;
          }
          function Qe(t, e, r) {
            var i = vr(t);
            i.size = t.size;
            i.has = function (e) {
              return t.has(e);
            };
            i.get = function (i, n) {
              var s = t.get(i, b);
              return s === b ? n : e.call(r, s, i, t);
            };
            i.__iterateUncached = function (i, n) {
              var s = this;
              return t.__iterate(function (t, n, a) {
                return !1 !== i(e.call(r, t, n, a), n, s);
              }, n);
            };
            i.__iteratorUncached = function (i, n) {
              var s = t.__iterator(M, n);
              return new A(function () {
                var n = s.next();
                if (n.done) return n;
                var a = n.value,
                  o = a[0];
                return P(i, o, e.call(r, a[1], o, t), n);
              });
            };
            return i;
          }
          function Ze(t, e) {
            var r = vr(t);
            r._iter = t;
            r.size = t.size;
            r.reverse = function () {
              return t;
            };
            t.flip &&
              (r.flip = function () {
                var e = Ye(t);
                e.reverse = function () {
                  return t.flip();
                };
                return e;
              });
            r.get = function (r, i) {
              return t.get(e ? r : -1 - r, i);
            };
            r.has = function (r) {
              return t.has(e ? r : -1 - r);
            };
            r.includes = function (e) {
              return t.includes(e);
            };
            r.cacheResult = br;
            r.__iterate = function (e, r) {
              var i = this;
              return t.__iterate(function (t, r) {
                return e(t, r, i);
              }, !r);
            };
            r.__iterator = function (e, r) {
              return t.__iterator(e, !r);
            };
            return r;
          }
          function tr(t, e, r, i) {
            var n = vr(t);
            if (i) {
              n.has = function (i) {
                var n = t.get(i, b);
                return n !== b && !!e.call(r, n, i, t);
              };
              n.get = function (i, n) {
                var s = t.get(i, b);
                return s !== b && e.call(r, s, i, t) ? s : n;
              };
            }
            n.__iterateUncached = function (n, s) {
              var a = this,
                o = 0;
              t.__iterate(function (t, s, c) {
                if (e.call(r, t, s, c)) {
                  o++;
                  return n(t, i ? s : o - 1, a);
                }
              }, s);
              return o;
            };
            n.__iteratorUncached = function (n, s) {
              var a = t.__iterator(M, s),
                o = 0;
              return new A(function () {
                for (;;) {
                  var s = a.next();
                  if (s.done) return s;
                  var c = s.value,
                    u = c[0],
                    l = c[1];
                  if (e.call(r, l, u, t)) return P(n, i ? u : o++, l, s);
                }
              });
            };
            return n;
          }
          function er(t, e, r) {
            var i = $t().asMutable();
            t.__iterate(function (n, s) {
              i.update(e.call(r, n, s, t), 0, function (t) {
                return t + 1;
              });
            });
            return i.asImmutable();
          }
          function rr(t, e, r) {
            var i = o(t),
              n = (l(t) ? He() : $t()).asMutable();
            t.__iterate(function (s, a) {
              n.update(e.call(r, s, a, t), function (t) {
                return ((t = t || []).push(i ? [a, s] : s), t);
              });
            });
            var s = _r(t);
            return n.map(function (e) {
              return dr(t, s(e));
            });
          }
          function ir(t, e, r, i) {
            var n = t.size;
            void 0 !== e && (e |= 0);
            void 0 !== r && (r === 1 / 0 ? (r = n) : (r |= 0));
            if (R(e, r, n)) return t;
            var s = D(e, n),
              a = z(r, n);
            if (s != s || a != a) return ir(t.toSeq().cacheResult(), e, r, i);
            var o,
              c = a - s;
            c == c && (o = c < 0 ? 0 : c);
            var u = vr(t);
            u.size = 0 === o ? o : (t.size && o) || void 0;
            !i &&
              st(t) &&
              o >= 0 &&
              (u.get = function (e, r) {
                return (e = O(this, e)) >= 0 && e < o ? t.get(e + s, r) : r;
              });
            u.__iterateUncached = function (e, r) {
              var n = this;
              if (0 === o) return 0;
              if (r) return this.cacheResult().__iterate(e, r);
              var a = 0,
                c = !0,
                u = 0;
              t.__iterate(function (t, r) {
                if (!c || !(c = a++ < s)) {
                  u++;
                  return !1 !== e(t, i ? r : u - 1, n) && u !== o;
                }
              });
              return u;
            };
            u.__iteratorUncached = function (e, r) {
              if (0 !== o && r) return this.cacheResult().__iterator(e, r);
              var n = 0 !== o && t.__iterator(e, r),
                a = 0,
                c = 0;
              return new A(function () {
                for (; a++ < s; ) n.next();
                if (++c > o) return F();
                var t = n.next();
                return i || e === j ? t : P(e, c - 1, e === q ? void 0 : t.value[1], t);
              });
            };
            return u;
          }
          function nr(t, e, r) {
            var i = vr(t);
            i.__iterateUncached = function (i, n) {
              var s = this;
              if (n) return this.cacheResult().__iterate(i, n);
              var a = 0;
              t.__iterate(function (t, n, o) {
                return e.call(r, t, n, o) && ++a && i(t, n, s);
              });
              return a;
            };
            i.__iteratorUncached = function (i, n) {
              var s = this;
              if (n) return this.cacheResult().__iterator(i, n);
              var a = t.__iterator(M, n),
                o = !0;
              return new A(function () {
                if (!o) return F();
                var t = a.next();
                if (t.done) return t;
                var n = t.value,
                  c = n[0],
                  u = n[1];
                if (!e.call(r, u, c, s)) {
                  o = !1;
                  return F();
                }
                return i === M ? t : P(i, c, u, t);
              });
            };
            return i;
          }
          function sr(t, e, r, i) {
            var n = vr(t);
            n.__iterateUncached = function (n, s) {
              var a = this;
              if (s) return this.cacheResult().__iterate(n, s);
              var o = !0,
                c = 0;
              t.__iterate(function (t, s, u) {
                if (!o || !(o = e.call(r, t, s, u))) {
                  c++;
                  return n(t, i ? s : c - 1, a);
                }
              });
              return c;
            };
            n.__iteratorUncached = function (n, s) {
              var a = this;
              if (s) return this.cacheResult().__iterator(n, s);
              var o = t.__iterator(M, s),
                c = !0,
                u = 0;
              return new A(function () {
                var t, s, l;
                do {
                  if ((t = o.next()).done)
                    return i || n === j ? t : P(n, u++, n === q ? void 0 : t.value[1], t);
                  var p = t.value;
                  s = p[0];
                  l = p[1];
                  c && (c = e.call(r, l, s, a));
                } while (c);
                return n === M ? t : P(n, s, l, t);
              });
            };
            return n;
          }
          function ar(t, e) {
            var r = o(t),
              n = [t]
                .concat(e)
                .map(function (t) {
                  a(t) ? r && (t = i(t)) : (t = r ? ot(t) : ct(Array.isArray(t) ? t : [t]));
                  return t;
                })
                .filter(function (t) {
                  return 0 !== t.size;
                });
            if (0 === n.length) return t;
            if (1 === n.length) {
              var s = n[0];
              if (s === t || (r && o(s)) || (c(t) && c(s))) return s;
            }
            var u = new et(n);
            r ? (u = u.toKeyedSeq()) : c(t) || (u = u.toSetSeq());
            (u = u.flatten(!0)).size = n.reduce(function (t, e) {
              if (void 0 !== t) {
                var r = e.size;
                if (void 0 !== r) return t + r;
              }
            }, 0);
            return u;
          }
          function or(t, e, r) {
            var i = vr(t);
            i.__iterateUncached = function (i, n) {
              var s = 0,
                o = !1;
              function c(t, u) {
                var l = this;
                t.__iterate(function (t, n) {
                  (!e || u < e) && a(t) ? c(t, u + 1) : !1 === i(t, r ? n : s++, l) && (o = !0);
                  return !o;
                }, n);
              }
              c(t, 0);
              return s;
            };
            i.__iteratorUncached = function (i, n) {
              var s = t.__iterator(i, n),
                o = [],
                c = 0;
              return new A(function () {
                for (; s; ) {
                  var t = s.next();
                  if (!1 === t.done) {
                    var u = t.value;
                    i === M && (u = u[1]);
                    if ((e && !(o.length < e)) || !a(u)) return r ? t : P(i, c++, u, t);
                    o.push(s);
                    s = u.__iterator(i, n);
                  } else s = o.pop();
                }
                return F();
              });
            };
            return i;
          }
          function cr(t, e, r) {
            var i = _r(t);
            return t
              .toSeq()
              .map(function (n, s) {
                return i(e.call(r, n, s, t));
              })
              .flatten(!0);
          }
          function ur(t, e) {
            var r = vr(t);
            r.size = t.size && 2 * t.size - 1;
            r.__iterateUncached = function (r, i) {
              var n = this,
                s = 0;
              t.__iterate(function (t, i) {
                return (!s || !1 !== r(e, s++, n)) && !1 !== r(t, s++, n);
              }, i);
              return s;
            };
            r.__iteratorUncached = function (r, i) {
              var n,
                s = t.__iterator(j, i),
                a = 0;
              return new A(function () {
                return (!n || a % 2) && (n = s.next()).done
                  ? n
                  : a % 2
                    ? P(r, a++, e)
                    : P(r, a++, n.value, n);
              });
            };
            return r;
          }
          function lr(t, e, r) {
            e || (e = yr);
            var i = o(t),
              n = 0,
              s = t
                .toSeq()
                .map(function (e, i) {
                  return [i, e, n++, r ? r(e, i, t) : e];
                })
                .toArray();
            s.sort(function (t, r) {
              return e(t[3], r[3]) || t[2] - r[2];
            }).forEach(
              i
                ? function (t, e) {
                    s[e].length = 2;
                  }
                : function (t, e) {
                    s[e] = t[1];
                  }
            );
            return i ? G(s) : c(t) ? J(s) : X(s);
          }
          function pr(t, e, r) {
            e || (e = yr);
            if (r) {
              var i = t
                .toSeq()
                .map(function (e, i) {
                  return [e, r(e, i, t)];
                })
                .reduce(function (t, r) {
                  return hr(e, t[1], r[1]) ? r : t;
                });
              return i && i[0];
            }
            return t.reduce(function (t, r) {
              return hr(e, t, r) ? r : t;
            });
          }
          function hr(t, e, r) {
            var i = t(r, e);
            return (0 === i && r !== e && (null == r || r != r)) || i > 0;
          }
          function fr(t, e, i) {
            var n = vr(t);
            n.size = new et(i)
              .map(function (t) {
                return t.size;
              })
              .min();
            n.__iterate = function (t, e) {
              for (
                var r, i = this.__iterator(j, e), n = 0;
                !(r = i.next()).done && !1 !== t(r.value, n++, this);

              );
              return n;
            };
            n.__iteratorUncached = function (t, n) {
              var s = i.map(function (t) {
                  return ((t = r(t)), $(n ? t.reverse() : t));
                }),
                a = 0,
                o = !1;
              return new A(function () {
                var r;
                if (!o) {
                  r = s.map(function (t) {
                    return t.next();
                  });
                  o = r.some(function (t) {
                    return t.done;
                  });
                }
                return o
                  ? F()
                  : P(
                      t,
                      a++,
                      e.apply(
                        null,
                        r.map(function (t) {
                          return t.value;
                        })
                      )
                    );
              });
            };
            return n;
          }
          function dr(t, e) {
            return st(t) ? e : t.constructor(e);
          }
          function mr(t) {
            if (t !== Object(t)) throw new TypeError('Expected [K, V] tuple: ' + t);
          }
          function gr(t) {
            Bt(t.size);
            return I(t);
          }
          function _r(t) {
            return o(t) ? i : c(t) ? n : s;
          }
          function vr(t) {
            return Object.create((o(t) ? G : c(t) ? J : X).prototype);
          }
          function br() {
            if (this._iter.cacheResult) {
              this._iter.cacheResult();
              this.size = this._iter.size;
              return this;
            }
            return V.prototype.cacheResult.call(this);
          }
          function yr(t, e) {
            return t > e ? 1 : t < e ? -1 : 0;
          }
          function Er(t) {
            var e = $(t);
            if (!e) {
              if (!K(t)) throw new TypeError('Expected iterable or array-like: ' + t);
              e = $(r(t));
            }
            return e;
          }
          e(wr, St);
          function wr(t, e) {
            var r,
              i = function (s) {
                if (s instanceof i) return s;
                if (!(this instanceof i)) return new i(s);
                if (!r) {
                  r = !0;
                  var a = Object.keys(t);
                  Ir(n, a);
                  n.size = a.length;
                  n._name = e;
                  n._keys = a;
                  n._defaultValues = t;
                }
                this._map = $t(s);
              },
              n = (i.prototype = Object.create(Sr));
            n.constructor = i;
            return i;
          }
          wr.prototype.toString = function () {
            return this.__toString(kr(this) + ' {', '}');
          };
          wr.prototype.has = function (t) {
            return this._defaultValues.hasOwnProperty(t);
          };
          wr.prototype.get = function (t, e) {
            if (!this.has(t)) return e;
            var r = this._defaultValues[t];
            return this._map ? this._map.get(t, r) : r;
          };
          wr.prototype.clear = function () {
            if (this.__ownerID) {
              this._map && this._map.clear();
              return this;
            }
            var t = this.constructor;
            return t._empty || (t._empty = xr(this, ne()));
          };
          wr.prototype.set = function (t, e) {
            if (!this.has(t)) throw new Error('Cannot set unknown key "' + t + '" on ' + kr(this));
            if (this._map && !this._map.has(t) && e === this._defaultValues[t]) return this;
            var r = this._map && this._map.set(t, e);
            return this.__ownerID || r === this._map ? this : xr(this, r);
          };
          wr.prototype.remove = function (t) {
            if (!this.has(t)) return this;
            var e = this._map && this._map.remove(t);
            return this.__ownerID || e === this._map ? this : xr(this, e);
          };
          wr.prototype.wasAltered = function () {
            return this._map.wasAltered();
          };
          wr.prototype.__iterator = function (t, e) {
            var r = this;
            return i(this._defaultValues)
              .map(function (t, e) {
                return r.get(e);
              })
              .__iterator(t, e);
          };
          wr.prototype.__iterate = function (t, e) {
            var r = this;
            return i(this._defaultValues)
              .map(function (t, e) {
                return r.get(e);
              })
              .__iterate(t, e);
          };
          wr.prototype.__ensureOwner = function (t) {
            if (t === this.__ownerID) return this;
            var e = this._map && this._map.__ensureOwner(t);
            if (!t) {
              this.__ownerID = t;
              this._map = e;
              return this;
            }
            return xr(this, e, t);
          };
          var Sr = wr.prototype;
          Sr[m] = Sr.remove;
          Sr.deleteIn = Sr.removeIn = Gt.removeIn;
          Sr.merge = Gt.merge;
          Sr.mergeWith = Gt.mergeWith;
          Sr.mergeIn = Gt.mergeIn;
          Sr.mergeDeep = Gt.mergeDeep;
          Sr.mergeDeepWith = Gt.mergeDeepWith;
          Sr.mergeDeepIn = Gt.mergeDeepIn;
          Sr.setIn = Gt.setIn;
          Sr.update = Gt.update;
          Sr.updateIn = Gt.updateIn;
          Sr.withMutations = Gt.withMutations;
          Sr.asMutable = Gt.asMutable;
          Sr.asImmutable = Gt.asImmutable;
          function xr(t, e, r) {
            var i = Object.create(Object.getPrototypeOf(t));
            i._map = e;
            i.__ownerID = r;
            return i;
          }
          function kr(t) {
            return t._name || t.constructor.name || 'Record';
          }
          function Ir(t, e) {
            try {
              e.forEach(Or.bind(void 0, t));
            } catch (t) {}
          }
          function Or(t, e) {
            Object.defineProperty(t, e, {
              get: function () {
                return this.get(e);
              },
              set: function (t) {
                yt(this.__ownerID, 'Cannot set on an immutable record.');
                this.set(e, t);
              },
            });
          }
          e(Cr, kt);
          function Cr(t) {
            return null == t
              ? Mr()
              : Rr(t) && !l(t)
                ? t
                : Mr().withMutations(function (e) {
                    var r = s(t);
                    Bt(r.size);
                    r.forEach(function (t) {
                      return e.add(t);
                    });
                  });
          }
          Cr.of = function () {
            return this(arguments);
          };
          Cr.fromKeys = function (t) {
            return this(i(t).keySeq());
          };
          Cr.prototype.toString = function () {
            return this.__toString('Set {', '}');
          };
          Cr.prototype.has = function (t) {
            return this._map.has(t);
          };
          Cr.prototype.add = function (t) {
            return qr(this, this._map.set(t, !0));
          };
          Cr.prototype.remove = function (t) {
            return qr(this, this._map.remove(t));
          };
          Cr.prototype.clear = function () {
            return qr(this, this._map.clear());
          };
          Cr.prototype.union = function () {
            var e = t.call(arguments, 0);
            return 0 ===
              (e = e.filter(function (t) {
                return 0 !== t.size;
              })).length
              ? this
              : 0 !== this.size || this.__ownerID || 1 !== e.length
                ? this.withMutations(function (t) {
                    for (var r = 0; r < e.length; r++)
                      s(e[r]).forEach(function (e) {
                        return t.add(e);
                      });
                  })
                : this.constructor(e[0]);
          };
          Cr.prototype.intersect = function () {
            var e = t.call(arguments, 0);
            if (0 === e.length) return this;
            e = e.map(function (t) {
              return s(t);
            });
            var r = this;
            return this.withMutations(function (t) {
              r.forEach(function (r) {
                e.every(function (t) {
                  return t.includes(r);
                }) || t.remove(r);
              });
            });
          };
          Cr.prototype.subtract = function () {
            var e = t.call(arguments, 0);
            if (0 === e.length) return this;
            e = e.map(function (t) {
              return s(t);
            });
            var r = this;
            return this.withMutations(function (t) {
              r.forEach(function (r) {
                e.some(function (t) {
                  return t.includes(r);
                }) && t.remove(r);
              });
            });
          };
          Cr.prototype.merge = function () {
            return this.union.apply(this, arguments);
          };
          Cr.prototype.mergeWith = function (e) {
            var r = t.call(arguments, 1);
            return this.union.apply(this, r);
          };
          Cr.prototype.sort = function (t) {
            return Nr(lr(this, t));
          };
          Cr.prototype.sortBy = function (t, e) {
            return Nr(lr(this, e, t));
          };
          Cr.prototype.wasAltered = function () {
            return this._map.wasAltered();
          };
          Cr.prototype.__iterate = function (t, e) {
            var r = this;
            return this._map.__iterate(function (e, i) {
              return t(i, i, r);
            }, e);
          };
          Cr.prototype.__iterator = function (t, e) {
            return this._map
              .map(function (t, e) {
                return e;
              })
              .__iterator(t, e);
          };
          Cr.prototype.__ensureOwner = function (t) {
            if (t === this.__ownerID) return this;
            var e = this._map.__ensureOwner(t);
            if (!t) {
              this.__ownerID = t;
              this._map = e;
              return this;
            }
            return this.__make(e, t);
          };
          function Rr(t) {
            return !(!t || !t[zr]);
          }
          Cr.isSet = Rr;
          var Dr,
            zr = '@@__IMMUTABLE_SET__@@',
            Lr = Cr.prototype;
          Lr[zr] = !0;
          Lr[m] = Lr.remove;
          Lr.mergeDeep = Lr.merge;
          Lr.mergeDeepWith = Lr.mergeWith;
          Lr.withMutations = Gt.withMutations;
          Lr.asMutable = Gt.asMutable;
          Lr.asImmutable = Gt.asImmutable;
          Lr.__empty = Mr;
          Lr.__make = jr;
          function qr(t, e) {
            if (t.__ownerID) {
              t.size = e.size;
              t._map = e;
              return t;
            }
            return e === t._map ? t : 0 === e.size ? t.__empty() : t.__make(e);
          }
          function jr(t, e) {
            var r = Object.create(Lr);
            r.size = t ? t.size : 0;
            r._map = t;
            r.__ownerID = e;
            return r;
          }
          function Mr() {
            return Dr || (Dr = jr(ne()));
          }
          e(Nr, Cr);
          function Nr(t) {
            return null == t
              ? Fr()
              : Tr(t)
                ? t
                : Fr().withMutations(function (e) {
                    var r = s(t);
                    Bt(r.size);
                    r.forEach(function (t) {
                      return e.add(t);
                    });
                  });
          }
          Nr.of = function () {
            return this(arguments);
          };
          Nr.fromKeys = function (t) {
            return this(i(t).keySeq());
          };
          Nr.prototype.toString = function () {
            return this.__toString('OrderedSet {', '}');
          };
          function Tr(t) {
            return Rr(t) && l(t);
          }
          Nr.isOrderedSet = Tr;
          var Ur,
            Ar = Nr.prototype;
          Ar[d] = !0;
          Ar.__empty = Fr;
          Ar.__make = Pr;
          function Pr(t, e) {
            var r = Object.create(Ar);
            r.size = t ? t.size : 0;
            r._map = t;
            r.__ownerID = e;
            return r;
          }
          function Fr() {
            return Ur || (Ur = Pr(We()));
          }
          e(Hr, xt);
          function Hr(t) {
            return null == t ? Gr() : Br(t) ? t : Gr().unshiftAll(t);
          }
          Hr.of = function () {
            return this(arguments);
          };
          Hr.prototype.toString = function () {
            return this.__toString('Stack [', ']');
          };
          Hr.prototype.get = function (t, e) {
            var r = this._head;
            t = O(this, t);
            for (; r && t--; ) r = r.next;
            return r ? r.value : e;
          };
          Hr.prototype.peek = function () {
            return this._head && this._head.value;
          };
          Hr.prototype.push = function () {
            if (0 === arguments.length) return this;
            for (
              var t = this.size + arguments.length, e = this._head, r = arguments.length - 1;
              r >= 0;
              r--
            )
              e = { value: arguments[r], next: e };
            if (this.__ownerID) {
              this.size = t;
              this._head = e;
              this.__hash = void 0;
              this.__altered = !0;
              return this;
            }
            return Vr(t, e);
          };
          Hr.prototype.pushAll = function (t) {
            if (0 === (t = n(t)).size) return this;
            Bt(t.size);
            var e = this.size,
              r = this._head;
            t.reverse().forEach(function (t) {
              e++;
              r = { value: t, next: r };
            });
            if (this.__ownerID) {
              this.size = e;
              this._head = r;
              this.__hash = void 0;
              this.__altered = !0;
              return this;
            }
            return Vr(e, r);
          };
          Hr.prototype.pop = function () {
            return this.slice(1);
          };
          Hr.prototype.unshift = function () {
            return this.push.apply(this, arguments);
          };
          Hr.prototype.unshiftAll = function (t) {
            return this.pushAll(t);
          };
          Hr.prototype.shift = function () {
            return this.pop.apply(this, arguments);
          };
          Hr.prototype.clear = function () {
            if (0 === this.size) return this;
            if (this.__ownerID) {
              this.size = 0;
              this._head = void 0;
              this.__hash = void 0;
              this.__altered = !0;
              return this;
            }
            return Gr();
          };
          Hr.prototype.slice = function (t, e) {
            if (R(t, e, this.size)) return this;
            var r = D(t, this.size);
            if (z(e, this.size) !== this.size) return xt.prototype.slice.call(this, t, e);
            for (var i = this.size - r, n = this._head; r--; ) n = n.next;
            if (this.__ownerID) {
              this.size = i;
              this._head = n;
              this.__hash = void 0;
              this.__altered = !0;
              return this;
            }
            return Vr(i, n);
          };
          Hr.prototype.__ensureOwner = function (t) {
            if (t === this.__ownerID) return this;
            if (!t) {
              this.__ownerID = t;
              this.__altered = !1;
              return this;
            }
            return Vr(this.size, this._head, t, this.__hash);
          };
          Hr.prototype.__iterate = function (t, e) {
            if (e) return this.reverse().__iterate(t);
            for (var r = 0, i = this._head; i && !1 !== t(i.value, r++, this); ) i = i.next;
            return r;
          };
          Hr.prototype.__iterator = function (t, e) {
            if (e) return this.reverse().__iterator(t);
            var r = 0,
              i = this._head;
            return new A(function () {
              if (i) {
                var e = i.value;
                i = i.next;
                return P(t, r++, e);
              }
              return F();
            });
          };
          function Br(t) {
            return !(!t || !t[Wr]);
          }
          Hr.isStack = Br;
          var $r,
            Wr = '@@__IMMUTABLE_STACK__@@',
            Kr = Hr.prototype;
          Kr[Wr] = !0;
          Kr.withMutations = Gt.withMutations;
          Kr.asMutable = Gt.asMutable;
          Kr.asImmutable = Gt.asImmutable;
          Kr.wasAltered = Gt.wasAltered;
          function Vr(t, e, r, i) {
            var n = Object.create(Kr);
            n.size = t;
            n._head = e;
            n.__ownerID = r;
            n.__hash = i;
            n.__altered = !1;
            return n;
          }
          function Gr() {
            return $r || ($r = Vr(0));
          }
          function Jr(t, e) {
            var r = function (r) {
              t.prototype[r] = e[r];
            };
            Object.keys(e).forEach(r);
            Object.getOwnPropertySymbols && Object.getOwnPropertySymbols(e).forEach(r);
            return t;
          }
          r.Iterator = A;
          Jr(r, {
            toArray: function () {
              Bt(this.size);
              var t = new Array(this.size || 0);
              this.valueSeq().__iterate(function (e, r) {
                t[r] = e;
              });
              return t;
            },
            toIndexedSeq: function () {
              return new Ge(this);
            },
            toJS: function () {
              return this.toSeq()
                .map(function (t) {
                  return t && 'function' == typeof t.toJS ? t.toJS() : t;
                })
                .__toJS();
            },
            toJSON: function () {
              return this.toSeq()
                .map(function (t) {
                  return t && 'function' == typeof t.toJSON ? t.toJSON() : t;
                })
                .__toJS();
            },
            toKeyedSeq: function () {
              return new Ve(this, !0);
            },
            toMap: function () {
              return $t(this.toKeyedSeq());
            },
            toObject: function () {
              Bt(this.size);
              var t = {};
              this.__iterate(function (e, r) {
                t[r] = e;
              });
              return t;
            },
            toOrderedMap: function () {
              return He(this.toKeyedSeq());
            },
            toOrderedSet: function () {
              return Nr(o(this) ? this.valueSeq() : this);
            },
            toSet: function () {
              return Cr(o(this) ? this.valueSeq() : this);
            },
            toSetSeq: function () {
              return new Je(this);
            },
            toSeq: function () {
              return c(this) ? this.toIndexedSeq() : o(this) ? this.toKeyedSeq() : this.toSetSeq();
            },
            toStack: function () {
              return Hr(o(this) ? this.valueSeq() : this);
            },
            toList: function () {
              return xe(o(this) ? this.valueSeq() : this);
            },
            toString: function () {
              return '[Iterable]';
            },
            __toString: function (t, e) {
              return 0 === this.size
                ? t + e
                : t + ' ' + this.toSeq().map(this.__toStringMapper).join(', ') + ' ' + e;
            },
            concat: function () {
              return dr(this, ar(this, t.call(arguments, 0)));
            },
            includes: function (t) {
              return this.some(function (e) {
                return _t(e, t);
              });
            },
            entries: function () {
              return this.__iterator(M);
            },
            every: function (t, e) {
              Bt(this.size);
              var r = !0;
              this.__iterate(function (i, n, s) {
                if (!t.call(e, i, n, s)) {
                  r = !1;
                  return !1;
                }
              });
              return r;
            },
            filter: function (t, e) {
              return dr(this, tr(this, t, e, !0));
            },
            find: function (t, e, r) {
              var i = this.findEntry(t, e);
              return i ? i[1] : r;
            },
            forEach: function (t, e) {
              Bt(this.size);
              return this.__iterate(e ? t.bind(e) : t);
            },
            join: function (t) {
              Bt(this.size);
              t = void 0 !== t ? '' + t : ',';
              var e = '',
                r = !0;
              this.__iterate(function (i) {
                r ? (r = !1) : (e += t);
                e += null != i ? i.toString() : '';
              });
              return e;
            },
            keys: function () {
              return this.__iterator(q);
            },
            map: function (t, e) {
              return dr(this, Qe(this, t, e));
            },
            reduce: function (t, e, r) {
              Bt(this.size);
              var i, n;
              arguments.length < 2 ? (n = !0) : (i = e);
              this.__iterate(function (e, s, a) {
                if (n) {
                  n = !1;
                  i = e;
                } else i = t.call(r, i, e, s, a);
              });
              return i;
            },
            reduceRight: function (t, e, r) {
              var i = this.toKeyedSeq().reverse();
              return i.reduce.apply(i, arguments);
            },
            reverse: function () {
              return dr(this, Ze(this, !0));
            },
            slice: function (t, e) {
              return dr(this, ir(this, t, e, !0));
            },
            some: function (t, e) {
              return !this.every(ti(t), e);
            },
            sort: function (t) {
              return dr(this, lr(this, t));
            },
            values: function () {
              return this.__iterator(j);
            },
            butLast: function () {
              return this.slice(0, -1);
            },
            isEmpty: function () {
              return void 0 !== this.size
                ? 0 === this.size
                : !this.some(function () {
                    return !0;
                  });
            },
            count: function (t, e) {
              return I(t ? this.toSeq().filter(t, e) : this);
            },
            countBy: function (t, e) {
              return er(this, t, e);
            },
            equals: function (t) {
              return vt(this, t);
            },
            entrySeq: function () {
              var t = this;
              if (t._cache) return new et(t._cache);
              var e = t.toSeq().map(Zr).toIndexedSeq();
              e.fromEntrySeq = function () {
                return t.toSeq();
              };
              return e;
            },
            filterNot: function (t, e) {
              return this.filter(ti(t), e);
            },
            findEntry: function (t, e, r) {
              var i = r;
              this.__iterate(function (r, n, s) {
                if (t.call(e, r, n, s)) {
                  i = [n, r];
                  return !1;
                }
              });
              return i;
            },
            findKey: function (t, e) {
              var r = this.findEntry(t, e);
              return r && r[0];
            },
            findLast: function (t, e, r) {
              return this.toKeyedSeq().reverse().find(t, e, r);
            },
            findLastEntry: function (t, e, r) {
              return this.toKeyedSeq().reverse().findEntry(t, e, r);
            },
            findLastKey: function (t, e) {
              return this.toKeyedSeq().reverse().findKey(t, e);
            },
            first: function () {
              return this.find(C);
            },
            flatMap: function (t, e) {
              return dr(this, cr(this, t, e));
            },
            flatten: function (t) {
              return dr(this, or(this, t, !0));
            },
            fromEntrySeq: function () {
              return new Xe(this);
            },
            get: function (t, e) {
              return this.find(
                function (e, r) {
                  return _t(r, t);
                },
                void 0,
                e
              );
            },
            getIn: function (t, e) {
              for (var r, i = this, n = Er(t); !(r = n.next()).done; ) {
                var s = r.value;
                if ((i = i && i.get ? i.get(s, b) : b) === b) return e;
              }
              return i;
            },
            groupBy: function (t, e) {
              return rr(this, t, e);
            },
            has: function (t) {
              return this.get(t, b) !== b;
            },
            hasIn: function (t) {
              return this.getIn(t, b) !== b;
            },
            isSubset: function (t) {
              t = 'function' == typeof t.includes ? t : r(t);
              return this.every(function (e) {
                return t.includes(e);
              });
            },
            isSuperset: function (t) {
              return (t = 'function' == typeof t.isSubset ? t : r(t)).isSubset(this);
            },
            keyOf: function (t) {
              return this.findKey(function (e) {
                return _t(e, t);
              });
            },
            keySeq: function () {
              return this.toSeq().map(Qr).toIndexedSeq();
            },
            last: function () {
              return this.toSeq().reverse().first();
            },
            lastKeyOf: function (t) {
              return this.toKeyedSeq().reverse().keyOf(t);
            },
            max: function (t) {
              return pr(this, t);
            },
            maxBy: function (t, e) {
              return pr(this, e, t);
            },
            min: function (t) {
              return pr(this, t ? ei(t) : ni);
            },
            minBy: function (t, e) {
              return pr(this, e ? ei(e) : ni, t);
            },
            rest: function () {
              return this.slice(1);
            },
            skip: function (t) {
              return this.slice(Math.max(0, t));
            },
            skipLast: function (t) {
              return dr(this, this.toSeq().reverse().skip(t).reverse());
            },
            skipWhile: function (t, e) {
              return dr(this, sr(this, t, e, !0));
            },
            skipUntil: function (t, e) {
              return this.skipWhile(ti(t), e);
            },
            sortBy: function (t, e) {
              return dr(this, lr(this, e, t));
            },
            take: function (t) {
              return this.slice(0, Math.max(0, t));
            },
            takeLast: function (t) {
              return dr(this, this.toSeq().reverse().take(t).reverse());
            },
            takeWhile: function (t, e) {
              return dr(this, nr(this, t, e));
            },
            takeUntil: function (t, e) {
              return this.takeWhile(ti(t), e);
            },
            valueSeq: function () {
              return this.toIndexedSeq();
            },
            hashCode: function () {
              return this.__hash || (this.__hash = si(this));
            },
          });
          var Xr = r.prototype;
          Xr[p] = !0;
          Xr[U] = Xr.values;
          Xr.__toJS = Xr.toArray;
          Xr.__toStringMapper = ri;
          Xr.inspect = Xr.toSource = function () {
            return this.toString();
          };
          Xr.chain = Xr.flatMap;
          Xr.contains = Xr.includes;
          Jr(i, {
            flip: function () {
              return dr(this, Ye(this));
            },
            mapEntries: function (t, e) {
              var r = this,
                i = 0;
              return dr(
                this,
                this.toSeq()
                  .map(function (n, s) {
                    return t.call(e, [s, n], i++, r);
                  })
                  .fromEntrySeq()
              );
            },
            mapKeys: function (t, e) {
              var r = this;
              return dr(
                this,
                this.toSeq()
                  .flip()
                  .map(function (i, n) {
                    return t.call(e, i, n, r);
                  })
                  .flip()
              );
            },
          });
          var Yr = i.prototype;
          Yr[h] = !0;
          Yr[U] = Xr.entries;
          Yr.__toJS = Xr.toObject;
          Yr.__toStringMapper = function (t, e) {
            return JSON.stringify(e) + ': ' + ri(t);
          };
          Jr(n, {
            toKeyedSeq: function () {
              return new Ve(this, !1);
            },
            filter: function (t, e) {
              return dr(this, tr(this, t, e, !1));
            },
            findIndex: function (t, e) {
              var r = this.findEntry(t, e);
              return r ? r[0] : -1;
            },
            indexOf: function (t) {
              var e = this.keyOf(t);
              return void 0 === e ? -1 : e;
            },
            lastIndexOf: function (t) {
              var e = this.lastKeyOf(t);
              return void 0 === e ? -1 : e;
            },
            reverse: function () {
              return dr(this, Ze(this, !1));
            },
            slice: function (t, e) {
              return dr(this, ir(this, t, e, !1));
            },
            splice: function (t, e) {
              var r = arguments.length;
              e = Math.max(0 | e, 0);
              if (0 === r || (2 === r && !e)) return this;
              t = D(t, t < 0 ? this.count() : this.size);
              var i = this.slice(0, t);
              return dr(this, 1 === r ? i : i.concat(k(arguments, 2), this.slice(t + e)));
            },
            findLastIndex: function (t, e) {
              var r = this.findLastEntry(t, e);
              return r ? r[0] : -1;
            },
            first: function () {
              return this.get(0);
            },
            flatten: function (t) {
              return dr(this, or(this, t, !1));
            },
            get: function (t, e) {
              return (t = O(this, t)) < 0 ||
                this.size === 1 / 0 ||
                (void 0 !== this.size && t > this.size)
                ? e
                : this.find(
                    function (e, r) {
                      return r === t;
                    },
                    void 0,
                    e
                  );
            },
            has: function (t) {
              return (
                (t = O(this, t)) >= 0 &&
                (void 0 !== this.size
                  ? this.size === 1 / 0 || t < this.size
                  : -1 !== this.indexOf(t))
              );
            },
            interpose: function (t) {
              return dr(this, ur(this, t));
            },
            interleave: function () {
              var t = [this].concat(k(arguments)),
                e = fr(this.toSeq(), J.of, t),
                r = e.flatten(!0);
              e.size && (r.size = e.size * t.length);
              return dr(this, r);
            },
            keySeq: function () {
              return Et(0, this.size);
            },
            last: function () {
              return this.get(-1);
            },
            skipWhile: function (t, e) {
              return dr(this, sr(this, t, e, !1));
            },
            zip: function () {
              return dr(this, fr(this, ii, [this].concat(k(arguments))));
            },
            zipWith: function (t) {
              var e = k(arguments);
              e[0] = this;
              return dr(this, fr(this, t, e));
            },
          });
          n.prototype[f] = !0;
          n.prototype[d] = !0;
          Jr(s, {
            get: function (t, e) {
              return this.has(t) ? t : e;
            },
            includes: function (t) {
              return this.has(t);
            },
            keySeq: function () {
              return this.valueSeq();
            },
          });
          s.prototype.has = Xr.includes;
          s.prototype.contains = s.prototype.includes;
          Jr(G, i.prototype);
          Jr(J, n.prototype);
          Jr(X, s.prototype);
          Jr(St, i.prototype);
          Jr(xt, n.prototype);
          Jr(kt, s.prototype);
          function Qr(t, e) {
            return e;
          }
          function Zr(t, e) {
            return [e, t];
          }
          function ti(t) {
            return function () {
              return !t.apply(this, arguments);
            };
          }
          function ei(t) {
            return function () {
              return -t.apply(this, arguments);
            };
          }
          function ri(t) {
            return 'string' == typeof t ? JSON.stringify(t) : String(t);
          }
          function ii() {
            return k(arguments);
          }
          function ni(t, e) {
            return t < e ? 1 : t > e ? -1 : 0;
          }
          function si(t) {
            if (t.size === 1 / 0) return 0;
            var e = l(t),
              r = o(t),
              i = e ? 1 : 0;
            return ai(
              t.__iterate(
                r
                  ? e
                    ? function (t, e) {
                        i = (31 * i + oi(Ct(t), Ct(e))) | 0;
                      }
                    : function (t, e) {
                        i = (i + oi(Ct(t), Ct(e))) | 0;
                      }
                  : e
                    ? function (t) {
                        i = (31 * i + Ct(t)) | 0;
                      }
                    : function (t) {
                        i = (i + Ct(t)) | 0;
                      }
              ),
              i
            );
          }
          function ai(t, e) {
            e = It(e, 3432918353);
            e = It((e << 15) | (e >>> -15), 461845907);
            e = It((e << 13) | (e >>> -13), 5);
            e = It((e = ((e + 3864292196) | 0) ^ t) ^ (e >>> 16), 2246822507);
            return (e = Ot((e = It(e ^ (e >>> 13), 3266489909)) ^ (e >>> 16)));
          }
          function oi(t, e) {
            return (t ^ (e + 2654435769 + (t << 6) + (t >> 2))) | 0;
          }
          var ci = {
            Iterable: r,
            Seq: V,
            Collection: wt,
            Map: $t,
            OrderedMap: He,
            List: xe,
            Stack: Hr,
            Set: Cr,
            OrderedSet: Nr,
            Record: wr,
            Range: Et,
            Repeat: bt,
            is: _t,
            fromJS: ft,
          };
          !(function () {
            try {
              Object.defineProperty(Xr, 'length', {
                get: function () {
                  return this.size;
                },
              });
            } catch (t) {}
          })();
          return ci;
        }),
          (t.exports = e()));
        var e;
      },
    },
    e = {};
  function r(i) {
    var n = e[i];
    if (void 0 !== n) return n.exports;
    var s = (e[i] = { exports: {} });
    t[i].call(s.exports, s, s.exports, r);
    return s.exports;
  }
  r.n = function (t) {
    var e =
      t && t.__esModule
        ? function () {
            return t.default;
          }
        : function () {
            return t;
          };
    r.d(e, { a: e });
    return e;
  };
  r.d = function (t, e) {
    for (var i in e)
      r.o(e, i) && !r.o(t, i) && Object.defineProperty(t, i, { enumerable: !0, get: e[i] });
  };
  r.g = (function () {
    if ('object' == typeof globalThis) return globalThis;
    try {
      return this || new Function('return this')();
    } catch (t) {
      if ('object' == typeof window) return window;
    }
  })();
  r.o = function (t, e) {
    return Object.prototype.hasOwnProperty.call(t, e);
  };
  r.r = function (t) {
    'undefined' != typeof Symbol &&
      Symbol.toStringTag &&
      Object.defineProperty(t, Symbol.toStringTag, { value: 'Module' });
    Object.defineProperty(t, '__esModule', { value: !0 });
  };
  !(function () {
    'use strict';
    r(2);
    var t = self.location,
      e = chrome,
      i = {
        id: null,
        pathRegex: /^\/(?:[A-Za-z0-9-_]*)\/(\d+)(?:\/|$)/,
        queryParamRegex: /(?:\?|&)portalid=(\d+)/i,
        getPortalIdFromPath(t) {
          if (document) {
            null == t && (t = this.pathRegex);
            return this.parsePortalIdFromString(document.location.pathname, t);
          }
        },
        getPortalIdFromQueryParam() {
          if (document)
            return this.parsePortalIdFromString(document.location.search, this.queryParamRegex);
        },
        parsePortalIdFromString(t, e) {
          const r = e.exec(t),
            i = null != r ? r[1] : void 0;
          return i ? +i : void 0;
        },
        get(t) {
          null == t && (t = {});
          if (this.id && !t.reparse) return this.id;
          const e = this.getPortalIdFromPath(t.regex) || this.getPortalIdFromQueryParam();
          if (!t.preserveGlobalId) {
            null == window.hubspot && (window.hubspot = {});
            null == window.hubspot.portal && (window.hubspot.portal = {});
            null == window.hubspot.portal.id && (window.hubspot.portal.id = e);
            e && (this.id = e);
          }
          return e;
        },
      };
    window.open;
    const n = window.chrome;
    var s = r(18),
      a = r.n(s);
    const o = 2e3,
      c = ['number', 'description', 'line', 'column'],
      u = t => {
        if (!t || 'object' != typeof t) return null;
        const e = Object.keys(t).filter(t => !c.includes(t));
        return e.length
          ? e.reduce((e, r) => {
              switch (typeof t[r]) {
                case 'boolean':
                case 'number':
                  e[r] = t[r];
                  break;
                case 'string': {
                  const i = t[r].length > o ? '...' : '';
                  e[r] = `${t[r].substr(0, o)}${i}`;
                  break;
                }
                case 'function':
                  e[r] = 'function() { /* Function removed */ }';
                  break;
                case 'object':
                  null === t[r] ? (e[r] = t[r]) : (e[r] = '/* Object, Error, or Array removed */');
              }
              return e;
            }, {})
          : null;
      };
    class l {
      constructor() {
        this._assignMethods();
      }
      _assignMethods() {
        this.log = this._getLogFn('log', l.LEVELS.log);
        this.debug = this._getLogFn('debug', l.LEVELS.debug);
        this.info = this._getLogFn('info', l.LEVELS.info);
        this.warn = this._getLogFn('warn', l.LEVELS.warn);
        this.warning = this.warn;
        this.error = this._getLogFn('error', l.LEVELS.error);
        this.fatal = this.error;
      }
      _getLogFn(t, e) {
        if (!this._shouldLog(t, e)) return () => {};
        const r = l.CONSOLE_FN[t] || l.CONSOLE_FN.log || (() => {});
        return function (...t) {
          const e = new Array(t.length + 1);
          e[0] = '[HubSpot Sales]';
          for (let r = 0; r < t.length; r++) {
            const i = t[r];
            e[r + 1] = this._formatError(i);
          }
          return this._callLogFn(r, e);
        }.bind(this);
      }
      _callLogFn(t, e) {
        return t.apply(l.CONSOLE_FN, e);
      }
      _shouldLog(t, e) {
        return this._aboveLevelThreshold(e);
      }
      _aboveLevelThreshold(t) {
        return t >= l.LEVELS.log;
      }
      _formatError(t) {
        return t instanceof Error
          ? t.stack
            ? t.message && -1 === t.stack.indexOf(t.message)
              ? `Error: ${t.message}\n${t.stack}`
              : t.stack
            : t.sourceURL
              ? `${t.message}\n${t.sourceURL}:${t.line}`
              : t
          : t;
      }
    }
    l.LEVELS = { log: 0, debug: 1, info: 2, warn: 3, error: 4 };
    l.CONSOLE_FN = window.console || {};
    var p = new l();
    const h = 'hs_debugLogCache',
      f = t => {
        it({ [h]: t }).catch(e => {
          y({
            error: e,
            fingerprint: ['debugLogManagerChromeExt/setDebugCacheInChromeStorage'],
            tags: { source: 'localSet' },
            extraData: { params: [{ [h]: t }] },
          });
        });
      },
      d = t => {
        _(t, !0);
      };
    let m, g;
    const _ = (t, e = !1) => {
        if (t && m)
          try {
            const { errors: r } = m;
            if (!r.some(e => t.message === e.message && t.detail === e.detail)) {
              r.length >= g && r.shift();
              r.push(t);
              e && f(m);
            }
          } catch (t) {}
      },
      v = ({
        error: t = null,
        message: e = null,
        level: r = 'info',
        stacktrace: i = null,
        fingerprint: n = null,
        tags: s = {},
        extraData: o = null,
        logger: c,
        cache: l,
      }) => {
        const p = { level: r, tags: s };
        try {
          if (null === t) {
            e || (e = 'No message provided');
            o && (p.extra = o);
            null !== i && (p.stacktrace = i);
            a().captureMessage(e, p);
            l && _({ message: e, detail: o ? JSON.stringify(o) : null });
          } else {
            t && !o && (o = u(t));
            n && (p.fingerprint = n);
            o && (p.extra = o);
            a().captureException(t, p);
            l &&
              _({
                message: t.message || e || 'No error message provided',
                detail: o ? JSON.stringify(o) : null,
              });
          }
          const r = a().lastEventId();
          c(
            `(Sentry Event Id: ${r || ''})\nError reported with error.message: ${t && t.message}, message: ${e || 'none'}`
          );
          o &&
            'object' == typeof o &&
            Object.keys(o).forEach(t => {
              o[t] && c(`Extra Data [${t}]: `, o[t]);
            });
          return r;
        } catch (u) {
          a().captureException(u, {
            level: t,
            tags: { reportErrorFailure: !0 },
            fingerprint: ['reportError'],
            extra: Object.assign({}, o, {
              reportErrorParams: {
                error: t,
                message: e,
                level: r,
                stacktrace: i,
                fingerprint: n,
                tags: s,
                cache: l,
              },
            }),
          });
          c(u);
          return a().lastEventId();
        }
      },
      b = t => v(Object.assign({ logger: t.logger || p.error }, t, { level: 'error', cache: !0 })),
      y = t => v(Object.assign({ logger: t.logger || p.info }, t, { level: 'info' })),
      E = 5,
      w = 'SEND_MESSAGE',
      S = 'ON_MESSAGE_LISTENER',
      x = 'ON_REMOVE_MESSAGE_LISTENER',
      k = 'ON_CONNECT_LISTENER',
      I = 'ON_INSTALLED_LISTENER',
      O = 'ON_UPDATE_AVAILABLE_LISTENER',
      C = 'REQUEST_UPDATE_CHECK',
      R = 'CONNECT',
      D = 'RELOAD',
      z = 'LAST_ERROR',
      L = 'GET_MANIFEST_VERSION',
      q = 'GET_EXTENSION_ID',
      j = (t, ...e) => {
        try {
          switch (t) {
            case w:
              return n.runtime.sendMessage(...e);
            case S:
              return n.runtime.onMessage.addListener(...e);
            case x:
              return n.runtime.onMessage.removeListener(...e);
            case k:
              return n.runtime.onConnect.addListener(...e);
            case R:
              return n.runtime.connect(...e);
            case D:
              return n.runtime.reload();
            case z:
              return n.runtime.lastError;
            case L:
              return n.runtime.getManifest().version;
            case q:
              return n.runtime.id;
            case I:
              return n.runtime.onInstalled.addListener(...e);
            case O:
              return n.runtime.onUpdateAvailable.addListener(...e);
            case C:
              return n.runtime.requestUpdateCheck(...e);
            default:
              return null;
          }
        } catch (e) {
          if (!n.runtime) {
            sessionStorage.runtimeError
              ? sessionStorage.runtimeError > E
                ? y({
                    error: e,
                    fingerprint: ['chrome runtime/storage is undefined'],
                    tags: { runtimeUndefined: t },
                    extraData: {
                      runtimeUndefined: t,
                      messageString: 'SafeRuntime chrome.runtime is undefined',
                    },
                  })
                : (sessionStorage.runtimeError = parseInt(sessionStorage.runtimeError, 10) + 1)
              : (sessionStorage.runtimeError = 1);
            return null;
          }
          b({
            error: e,
            fingerprint: ['Error in chrome safeRuntime', t],
            tags: { failingRuntimeMethod: t },
            extraData: {
              failingRuntimeMethod: t,
              errorMessageString: e instanceof Error ? e.message : 'unknown',
              messageString: 'Error in chrome safeRuntime',
            },
          });
          return null;
        }
      },
      M = () => {
        try {
          return n.runtime.getManifest().manifest_version >= 3;
        } catch (t) {
          return !1;
        }
      },
      N = t => j(S, t),
      T = t => j(x, t),
      U = () => j(z);
    function A(t, e, r) {
      return r || !M()
        ? new Promise((i, n) => {
            j(w, t, e, t => H(r, t, i, n));
          })
        : j(w, t, e);
    }
    const P = () => j(D);
    const F = [
        'A listener indicated an asynchronous response by returning true, but the message channel closed before a response was received',
      ],
      H = (t, e, r, i) => {
        const n = U();
        let s;
        if (t) {
          s = t(e);
          n && !F.includes(n.message) && r(n);
          r(e);
        } else {
          n && !F.includes(n.message) && i(n);
          r(e);
        }
        return s;
      },
      B = 'SYNC_GET',
      $ = 'SYNC_SET',
      W = 'SYNC_USAGE',
      K = 'SYNC_REMOVE',
      V = 'LOCAL_GET',
      G = 'LOCAL_SET',
      J = 'LOCAL_USAGE',
      X = 'LOCAL_REMOVE',
      Y = 'SESSION_GET',
      Q = 'SESSION_SET',
      Z = 'SESSION_USAGE',
      tt = 'SESSION_REMOVE',
      et = (t, ...e) => {
        try {
          switch (t) {
            case B:
              return n.storage.sync.get(...e);
            case $:
              return n.storage.sync.set(...e);
            case W:
              return n.storage.sync.getBytesInUse(...e);
            case K:
              return n.storage.sync.remove(...e);
            case V:
              return n.storage.local.get(...e);
            case G:
              return n.storage.local.set(...e);
            case J:
              return n.storage.local.getBytesInUse(...e);
            case X:
              return n.storage.local.remove(...e);
            case Y:
              return n.storage.session.get(...e);
            case Q:
              return n.storage.session.set(...e);
            case Z:
              return n.storage.session.getBytesInUse(...e);
            case tt:
              return n.storage.session.remove(...e);
            default:
              return null;
          }
        } catch (e) {
          n.storage && n.storage.sync && n.storage.local && n.storage.session
            ? b({
                error: e,
                fingerprint: ['Error in chrome safeStorage', t],
                tags: { failingStorageMethod: t },
                extraData: {
                  failingStorageMethod: t,
                  messageString: 'Error in chrome safeStorage',
                },
              })
            : sessionStorage.storageError
              ? sessionStorage.storageError > E
                ? y({
                    error: e,
                    fingerprint: ['chrome runtime/storage is undefined'],
                    tags: { storageUndefined: t },
                    extraData: {
                      storageUndefined: t,
                      messageString: 'SafeStorage chrome.storage is undefined',
                    },
                  })
                : (sessionStorage.runtimeError = parseInt(sessionStorage.runtimeError, 10) + 1)
              : (sessionStorage.storageError = 1);
          return null;
        }
      };
    function rt(t, e) {
      return e || !M()
        ? new Promise((r, i) => {
            et(V, t, t => H(e, t, r, i));
          })
        : et(V, t);
    }
    function it(t, e) {
      return e || !M()
        ? new Promise((r, i) => {
            et(G, t, () => H(e, void 0, r, i));
          })
        : et(G, t);
    }
    const nt = 'last_login_portal_id';
    var st = self.window.localStorage;
    const at = 'na1',
      ot = r(13),
      ct = ot.default || ot,
      ut = 'hubspot:crx:',
      lt = {},
      pt = 'HUBLET',
      ht = t => `${ut}:${t}`;
    function ft(t) {
      const e = lt[t];
      if (null != e) return e;
      try {
        const e = st[ht(t)];
        lt[t] = e;
        return e;
      } catch (t) {
        console.error('readChromeEnvironmentString', t);
      }
      return null;
    }
    function dt(t, e) {
      try {
        if (e) {
          lt[t] = e;
          st[ht(t)] = e;
        } else {
          delete st[ht(t)];
          delete lt[t];
        }
      } catch (t) {
        console.error('writeChromeEnvironmentString localStorage full?', t);
      }
    }
    const mt = ct.createEnviro(self.document.location);
    mt.getHublet = () => ft(pt) || at;
    mt.setHublet = t => {
      dt(pt, t);
    };
    mt.ifHublet = ({ isNa1: t, isNonNa1: e }, r) => {
      r || (r = mt.getHublet());
      return ct.ifHublet({ isNa1: t, isNonNa1: e }, r);
    };
    var gt = mt;
    self.hubspot.enviro = () => mt;
    self.enviro = mt;
    self.window.enviro = mt;
    const _t = 'chrome-extension:',
      { pathname: vt, protocol: bt } = t,
      yt = bt === _t && -1 !== vt.indexOf('Background-sw'),
      Et = bt === _t && -1 !== vt.indexOf('popup.html');
    let wt = null;
    wt = yt ? 'background' : Et ? 'popup' : 'content_script';
    var St = wt;
    const xt = () => {};
    class kt {
      constructor() {
        this.log = this._getLogFn('log', kt.LEVELS.log);
        this.debug = this._getLogFn('debug', kt.LEVELS.debug);
        this.info = this._getLogFn('info', kt.LEVELS.info);
        this.warn = this._getLogFn('warn', kt.LEVELS.warn);
        this.error = this._getLogFn('error', kt.LEVELS.error, !0);
      }
      _getLogFn(t, e, r = !1) {
        if (!this._shouldLog(t, e)) return xt;
        const i = kt.CONSOLE_FN[t] || kt.CONSOLE_FN.log || xt;
        return function (...t) {
          const n = new Array(t.length + 1);
          n[0] = `%c[HubSpot Sales] ${kt.LEVELS_MAP[e].padEnd(6)} - %c${new Date().toISOString().slice(11, -1)}%c:`;
          for (let e = 0; e < t.length; e++) {
            const r = t[e];
            n[e + 1] = this._formatError(r);
          }
          r && n.length > 1 && d({ message: n[1] });
          return this._callLogFn(i, [n.join(' '), 'color:grey', 'color:grey', 'color:orangered']);
        }.bind(this);
      }
      _callLogFn(t, e) {
        return t.apply(kt.CONSOLE_FN, e);
      }
      _shouldLog(t, e) {
        return 'background' === St || this._aboveLevelThreshold(e);
      }
      _aboveLevelThreshold(t) {
        return gt.deployed('console') ? t >= kt.LEVELS.error : t >= kt.LEVELS.log;
      }
      _formatError(t) {
        return t instanceof Error
          ? t.stack
            ? t.message && -1 === t.stack.indexOf(t.message)
              ? `Error: ${t.message}\n${t.stack}`
              : t.stack
            : t.sourceURL
              ? `${t.message}\n${t.sourceURL}:${t.line}`
              : t
          : t;
      }
    }
    kt.LEVELS = { log: 0, debug: 1, info: 2, warn: 3, error: 4 };
    kt.LEVELS_MAP = { 0: 'LOG', 1: 'DEBUG', 2: 'INFO', 3: 'WARN', 4: 'ERROR' };
    kt.CONSOLE_FN = self.console || {};
    var It = new kt();
    const Ot = 'hubspotEverywhereMethod',
      Ct = 'permission:request:origin',
      Rt = 'START_EVERYWHERE_DEMO',
      Dt = 'CONTINUE_EVERYWHERE_DEMO',
      zt = 'calendarConnected';
    let Lt;
    !(function (t) {
      t.CLEAR_BADGE = 'CLEAR_BADGE';
      t.UPDATE_BADGE_ICON = 'UPDATE_BADGE_ICON';
      t.UPDATE_BADGE_TEXT = 'UPDATE_BADGE_TEXT';
      t.OPEN_POPUP = 'OPEN_POPUP';
      t.IS_OPEN_POPUP_SUPPORTED = 'IS_OPEN_POPUP_SUPPORTED';
    })(Lt || (Lt = {}));
    const qt = 'shortlink';
    r(75);
    const jt = (t, e = null) => A(Object.assign({ method: t }, null != e && { data: e })),
      Mt = (t, e) => {
        const r = (r, i, n) => {
          if (null == i.tab && t === r.method)
            try {
              e(r.data, n);
              return;
            } catch (e) {
              console.error(e);
              console.info(t);
            }
        };
        N(r);
        return r;
      },
      Nt = 'HS_EVERYWHERE_WEBSITE_ALLOWLIST',
      Tt = ['GMAIL'];
    window.chrome;
    function Ut() {
      return rt(Nt).then(t => (t && t[Nt]) || Tt);
    }
    function At(t) {
      return it({ [Nt]: t });
    }
    const Pt = { APP: 'app', APP_API: 'app-api' };
    function Ft(t, e) {
      const r = e && e.hubletOverride ? e.hubletOverride : t,
        i = e && !0 === e.hubletizeNa1;
      return r !== at || i ? `-${r}` : '';
    }
    function Ht(t, e, r) {
      if (r && r.hubletPostfixLocation && 'domain' === r.hubletPostfixLocation) return e;
      e === Pt.APP_API && (e = Pt.APP);
      return `${e}${Ft(t, r)}`;
    }
    function Bt(t, e, r) {
      return `${Wt(r)}${$t(e, r)}${Kt(t, r)}`;
    }
    function $t(t, e) {
      return 'qa' === (e && e.envOverride ? e.envOverride : t) ? 'qa' : '';
    }
    function Wt(t) {
      return t && t.domainOverride ? t.domainOverride : 'hubspot';
    }
    function Kt(t, e) {
      return e && e.hubletPostfixLocation && 'domain' === e.hubletPostfixLocation ? Ft(t, e) : '';
    }
    function Vt(t) {
      return t && t.tldOverride ? t.tldOverride : 'com';
    }
    function Gt(t) {
      return t === Pt.APP_API ? '/api' : '';
    }
    function Jt(t) {
      return t && t.hubletOverride ? t.hubletOverride : gt.getHublet();
    }
    function Xt(t) {
      return t && t.envOverride ? t.envOverride : gt.getShort();
    }
    function Yt(t, e) {
      return Ht(Jt(e), t, e);
    }
    function Qt(t) {
      return Bt(Jt(t), Xt(t), t);
    }
    function Zt(t) {
      return Vt(t);
    }
    function te(t) {
      return Gt(t);
    }
    function ee(t, e) {
      return `https://${Yt(t, e)}.${Qt(e)}.${Zt(e)}${te(t)}`;
    }
    function re() {
      return ee(gt.deployed() ? 'app' : 'local');
    }
    const ie = t => {
        const e = t.data;
        p.debug(`shortlinkLoginListener - Received message: ${e}`);
        if (e.indexOf && -1 !== e.indexOf('PORTALID_')) {
          const t = e.split('_');
          it({ [nt]: { portal_id: Number(t[1]), hublet: t[3] } }).catch(() => {
            p.error('shortlinkLoginListener - Unable to set last portal in storage.local');
          });
          A({ method: qt, data: !1 }).catch(t => {
            throw t;
          });
        }
      },
      ne = t => {
        const e = t.data;
        p.debug(`everywhereOnboardDemoListener - Received message: ${e.type}`);
        switch (e.type) {
          case 'FROM_HOST_HANDSHAKE':
            window.postMessage({ type: 'FROM_EXTENSION_HANDSHAKE_ACK' }, re());
            break;
          case 'EXTENSION_ALLOWLIST_REQUEST':
            Ut()
              .then(t => {
                window.postMessage({ type: 'EVERYWHERE_SETTINGS_STATE', value: t }, re());
              })
              .catch(t => {
                p.error(
                  'everywhereOnboardDemoListener - Unable to get everywhere website allowlist'
                );
                throw t;
              });
            break;
          case 'ENABLE_EVERYWHERE_SETTINGS': {
            const t = Mt(Ct, ({ granted: r }) => {
              if (r) {
                At(e.value.newOriginPermissions)
                  .then(() => {
                    window.postMessage(
                      { type: 'EVERYWHERE_SETTINGS_STATE', value: e.value.newOriginPermissions },
                      re()
                    );
                  })
                  .catch(t => {
                    console.error(t);
                  });
                T(t);
              }
            });
            jt(Ct, e.value).catch(t => {
              console.error('sendMessage: PERMISSION_REQUEST_ORIGIN', t);
            });
          }
        }
        if (e.type === Rt) {
          const t = Mt('HS_CONTINUE_EVERYWHERE_DEMO', () => {
            T(t);
            window.postMessage({ type: Dt }, re());
          });
          jt(Ot, { type: Rt }).catch(t => {
            console.error('sendMessage: HUBSPOT_EVERYWHERE_METHOD: START_EVERYWHERE_DEMO', t);
          });
        }
      },
      se = t => {
        if (!t || !t.data) return;
        const e = t.data;
        if (e.method === zt) {
          p.debug('calendarConnectedListener - Received message: ', e);
          A({ method: zt, data: !1 }).catch(t => {
            throw t;
          });
        }
      },
      ae = 'SHORTLINK_OPEN',
      oe =
        (new RegExp(/.*:\/\/mail\.google\.com/),
        () => {
          try {
            'true' !== st.getItem(ae) && P();
          } catch (t) {
            It.log(`Failed to get SHORTLINK_OPEN : ${t}`);
            P();
          }
        });
    const ce =
        /^.*(hubspotqa|hubspot)\.com\/sales-clients-common-playground\/\d+\/chrome-extension.*/i,
      ue = /^.*(hubspotqa|hubspot)\.com\/sales-client-iframes\/\d+\/portal-picked$/,
      le = /^.*(hubspotqa|hubspot)\.com\/everywhere-onboarding(\/demo)*/,
      pe = /^.*(hubspotqa|hubspot)\.com\/settings\/\d+\/user-preferences\/calendar.*$/,
      he = 'sales:clients:emailAddresses',
      fe = 'last_login_portal_id';
    function de() {
      window.addEventListener('message', ie);
    }
    function me(t) {
      const { detail: e } = t,
        r = [];
      e.environment && r.push(it({ ENV: e.environment }));
      e.trackedAccounts && r.push(it({ [he]: e.trackedAccounts }));
      e.pickedPortal && r.push(it({ [fe]: e.pickedPortal }));
      Promise.all(r)
        .then(oe)
        .catch(t => {
          console.error('An error occurred:', t);
        });
    }
    function ge() {
      document.addEventListener('sales:extension:environment:update', me);
    }
    function _e() {
      const t = document.createElement('script');
      t.setAttribute('src', e.runtime.getURL('js/setSigExtWindowObject.ts'));
      (document.head || document.documentElement).appendChild(t);
      t.parentNode.removeChild(t);
    }
    function ve() {
      new BroadcastChannel('hubspot-sales-extension').onmessage = t => {
        e.runtime.sendMessage({ method: 'notificationReceived', data: t.data.id });
      };
    }
    function be() {
      try {
        const t = gt.getHublet(),
          e = i.get();
        rt(nt)
          .then(r => {
            if (!r[nt] && t && e) return it({ [nt]: { portal_id: e, hublet: t } });
          })
          .catch(() => {
            It.error('init/sigExt - unable to set portal id in storage.local');
          });
      } catch (t) {
        It.error(`get hublet and portalId: ${t.message || t}`);
      }
    }
    function ye() {
      window.postMessage({ type: 'FROM_EXTENSION_HANDSHAKE_ACK' }, re());
      ue.test(t.href) && de();
      ce.test(t.href) && ge();
      ve();
      le.test(t.href) && window.addEventListener('message', ne);
      pe.test(t.href) && window.addEventListener('message', se);
      be();
      _e();
    }
    document.addEventListener('DOMContentLoaded', ye, !1);
  })();
})();
//# sourceMappingURL=//static.hsappstatic.net/SignalsExtension/static-2.32896/js/sig-ext.js.map
