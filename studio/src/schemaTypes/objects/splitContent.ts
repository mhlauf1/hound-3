import {defineField, defineType} from 'sanity'
import {SplitHorizontalIcon} from '@sanity/icons'

export const splitContent = defineType({
  name: 'splitContent',
  title: 'Split Content',
  type: 'object',
  icon: SplitHorizontalIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'blockContent',
    }),
    defineField({
      name: 'link',
      title: 'Link',
      type: 'object',
      fields: [
        defineField({name: 'label', title: 'Label', type: 'string'}),
        defineField({name: 'link', title: 'Link', type: 'link'}),
      ],
    }),
    defineField({
      name: 'badge',
      title: 'Badge Image',
      type: 'image',
      description: 'Optional badge/logo (e.g. Embark logo)',
    }),
    defineField({
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'imagePosition',
      title: 'Image Position',
      type: 'string',
      options: {
        list: [
          {title: 'Left', value: 'left'},
          {title: 'Right', value: 'right'},
        ],
        layout: 'radio',
      },
      initialValue: 'right',
    }),
    defineField({
      name: 'backgroundColor',
      title: 'Background Color',
      type: 'string',
      options: {
        list: [
          {title: 'Tan', value: 'tan'},
          {title: 'Lavender', value: 'lavender'},
          {title: 'Dark', value: 'dark'},
        ],
        layout: 'radio',
      },
      initialValue: 'lavender',
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Split Content', subtitle: 'Split Content Section'}
    },
  },
})
