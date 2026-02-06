import {defineField, defineType} from 'sanity'
import {RocketIcon} from '@sanity/icons'

export const ctaBanner = defineType({
  name: 'ctaBanner',
  title: 'CTA Banner',
  type: 'object',
  icon: RocketIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button',
      type: 'button',
    }),
    defineField({
      name: 'showRating',
      title: 'Show Rating',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'ratingText',
      title: 'Rating Text',
      type: 'string',
      description: 'e.g. "4.4 stars — 100+ reviews on Google"',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'CTA Banner', subtitle: 'Call to Action Banner'}
    },
  },
})
