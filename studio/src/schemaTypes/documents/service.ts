import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons'

export const service = defineType({
  name: 'service',
  title: 'Service',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
    }),
    defineField({
      name: 'shortDescription',
      title: 'Short Description',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'tabImage',
      title: 'Tab Image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'tabCta',
      title: 'Tab CTA',
      type: 'button',
    }),
  ],
  preview: {
    select: {title: 'title', media: 'tabImage'},
  },
})
