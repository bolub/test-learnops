module.exports = {
  purge: { enabled: false },
  darkMode: false, // or 'media' or 'class'
  presets: [require('@getsynapse/design-system/tailwind.config')],
  theme: {
    extend: {
      backgroundSize: {
        '70%': '70%',
      },
      height: {
        '22': '5.5rem',
        '30': '7.5rem',
        '58': '14.5rem',
        '68': '17rem',
        '99': '24.75rem',
        '100': '25rem',
        '140px': '8.75rem',
        project: 'calc(100vh - 2.5rem)',
        stage: 'calc(100vh - 11rem)',
      },
      minHeight: {
        '14': '3.5rem',
        '10': '2.5rem',
        board: 'calc(100vh - 7rem)',
        card: '8.75rem',
      },
      margin: {
        '0.75': '0.1875rem',
        16.5: '4.5rem',
      },
      fontFamily: {
        landing: 'Montserrat',
      },
      fontSize: {
        tiny: ['9px', '11px'],
        '8': '0.5rem',
      },
      inset: {
        '6px': '6px',
        '120': '30rem',
      },
      keyframes: {
        loader: {
          '5%, 95%': {
            left: '0%',
          },
          '45%, 65%': {
            left: '100%',
            transform: 'translateX(-100%)',
          },
        },
        fadeOut: {
          '0%': {
            transform: 'translateX(0%)',
          },
          '100%': {
            transform: 'translateX(100%)',
          },
        },
        pushNotification: {
          '0%': {
            transform: 'translateX(100%)',
          },
          '100%': {
            transform: 'translateX(0%)',
          },
        },
      },
      animation: {
        loader: 'loader 3s ease-in-out infinite',
        pushNotify: 'pushNotification .7s',
        fade: 'fadeOut 1s ease-out',
      },
      transitionDelay: {
        '0': '0ms',
        '400': '400ms',
      },
      transitionProperty: ['width', 'motion-safe'],
      boxShadow: (theme) => ({
        header: '0px 2px 2px rgba(18, 21, 27, 0.05)',
        column: '1px 0px 1px rgba(18, 21, 27, 0.02)',
        'inner-l': `inset 4px 0 0 0 ${theme('colors.primary.DEFAULT')}`,
        'table-column': '1px 0px 1px rgba(18, 21, 27, 0.02)',
        'form-wrapper': `inset 0px 1px 0px ${theme('colors.neutral.lightest')}`,
        'toggle-button-group': 'inset 0px 1px 4px rgba(18, 21, 27, 0.1)',
      }),
      flex: {
        sticky: '0 0 auto',
      },
      spacing: {
        '10%': '10%',
        '15': '3.75rem',
        '31': '7.75rem',
        '66': '16.5rem',
        '88': '22rem',
        '148': '37rem',
        '100': '25rem',
        '92': '23rem',
        '74': '18.5rem',
        '30': '7.5rem',
        '47': '11.75rem',
        '50': '12.5rem',
        '61': '15.25rem',
        '26': '6.5rem',
        '58': '14.5rem',
      },
      zIndex: {
        '5': 5,
      },
      maxHeight: {
        table: 'calc(100vh - 11.25rem)',
        '26': '6.5rem',
        '136': '34rem',
        '124': '30rem',
      },
      width: {
        '58': '14.5rem',
        extra: '109%',
      },
      maxWidth: {
        table: 'calc(100% - 42rem)',
        card: '15.875rem',
      },
      minWidth: {
        '28': '7rem',
        '40': '10rem',
      },
      fill: (theme) => ({
        'neutral-black': theme('colors.neutral.dark'),
        primary: theme('colors.primary.DEFAULT'),
      }),
    },
  },
  variants: {
    extend: {
      maxHeight: ['focus'],
      fill: ['group-hover'],
      margin: ['last'],
    },
  },
  plugins: [require('@tailwindcss/line-clamp')],
};
