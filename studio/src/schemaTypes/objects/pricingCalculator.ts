import {defineField, defineType} from 'sanity'
import {ActivityIcon} from '@sanity/icons'

export const pricingCalculator = defineType({
  name: 'pricingCalculator',
  title: 'Pricing Calculator',
  type: 'object',
  icon: ActivityIcon,
  fields: [
    defineField({
      name: 'calculatorType',
      title: 'Calculator Type',
      type: 'string',
      options: {
        list: [
          {title: 'Daycare', value: 'daycare'},
          {title: 'Boarding', value: 'boarding'},
          {title: 'Grooming', value: 'grooming'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      initialValue: 'Pricing Calculator',
    }),
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ctaText',
      title: 'CTA Button Text',
      type: 'string',
      initialValue: 'Book Now',
    }),
    defineField({
      name: 'ctaLink',
      title: 'CTA Link',
      type: 'link',
    }),
    defineField({
      name: 'taxNote',
      title: 'Tax Note',
      type: 'string',
      initialValue: 'Prices shown before applicable tax',
    }),
  ],
  preview: {
    select: {
      title: 'heading',
      subtitle: 'calculatorType',
    },
    prepare({title, subtitle}) {
      return {
        title: title || 'Pricing Calculator',
        subtitle: subtitle ? `${subtitle.charAt(0).toUpperCase()}${subtitle.slice(1)} Calculator` : 'No type selected',
      }
    },
  },
})
