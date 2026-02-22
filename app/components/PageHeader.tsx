import styles from '@/app/stylesheet/globalstylesheet'
import React from 'react'
import { Text, View } from 'react-native'

type PageHeaderProps = {
  title: string
}

export default function PageHeader({ title }: PageHeaderProps) {
  return (
    <View style={[styles.centeralign, styles.margintop, styles.marginBottom1]}>
      <Text style={[styles.header]}>{title}</Text>
    </View>
  )
}
