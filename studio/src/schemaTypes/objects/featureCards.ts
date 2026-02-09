import {defineField, defineType, defineArrayMember} from 'sanity'
import {BlockElementIcon} from '@sanity/icons'

export const featureCards = defineType({
  name: 'featureCards',
  title: 'Feature Cards',
  type: 'object',
  icon: BlockElementIcon,
  fields: [
    defineField({
      name: 'heading',
      title: 'Heading',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'stickerLeft',
      title: 'Left Sticker',
      type: 'image',
      description: 'Dog sticker displayed to the left of the heading',
    }),
    defineField({
      name: 'stickerRight',
      title: 'Right Sticker',
      type: 'image',
      description: 'Dog sticker displayed to the right of the heading',
    }),
    defineField({
      name: 'features',
      title: 'Features',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'object',
          fields: [
            defineField({
              name: 'icon',
              title: 'Icon',
              type: 'string',
              description: 'Iconify icon name (e.g. "mdi:webcam", "mdi:bed")',
            }),
            defineField({
              name: 'title',
              title: 'Title',
              type: 'string',
              validation: (Rule) => Rule.required(),
            }),
            defineField({
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 3,
            }),
          ],
          preview: {
            select: {title: 'title', subtitle: 'icon'},
          },
        }),
      ],
    }),
    defineField({
      name: 'cta',
      title: 'CTA Button',
      type: 'button',
    }),
    defineField({
      name: 'trustLine',
      title: 'Trust Line',
      type: 'string',
    }),
    defineField({
      name: 'darkMode',
      title: 'Dark Mode',
      type: 'boolean',
      initialValue: true,
    }),
  ],
  preview: {
    select: {title: 'heading'},
    prepare({title}) {
      return {title: title || 'Feature Cards', subtitle: 'Feature Cards Section'}
    },
  },
})
