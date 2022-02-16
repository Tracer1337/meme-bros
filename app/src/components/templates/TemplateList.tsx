import React, { useState } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { Text, Surface, IconButton, TextInput } from "react-native-paper"
import Image from "react-native-scalable-image"
import { NavigationProp, useNavigation } from "@react-navigation/native"
import { useSharedContext, TemplateMeta, useModule } from "@meme-bros/client-lib"
import { RootStackParamList } from "../../Navigator"
import { useFilteredTemplates } from "./utils/filter"

function Item({ template, onLoad }: {
    template: TemplateMeta,
    onLoad: () => void
}) {
    const { getPreviewURI } = useModule("templates")

    return (
        <Surface style={styles.item}>
            <Image
                source={{ uri: getPreviewURI(template) }}
                height={150}
                width={150}
            />
            <View style={styles.itemContent}>
                <Text style={styles.itemTitle}>{ template.name }</Text>
                <IconButton
                    icon="chevron-right"
                    onPress={onLoad}
                    size={32}
                />
            </View>
        </Surface>
    )
}

function TemplateList({ templates }: {
    templates: TemplateMeta[]
}) {
    const context = useSharedContext()

    const { getCanvas } = useModule("templates")

    const navigation = useNavigation<NavigationProp<RootStackParamList>>()

    const [search, setSearch] = useState("")

    const filteredTemplates = useFilteredTemplates({ templates, search })

    const loadTemplate = async (template: TemplateMeta) => {
        const canvas = await getCanvas(template)
        context.events.emit("template.load", { template, canvas })
        navigation.navigate("Editor")
    }

    const renderItem = ({ item: template }: {
        item: TemplateMeta
    }) => {
        return (
            <Item
                template={template}
                onLoad={() => loadTemplate(template)}
            />
        )
    }

    return (
        <View>
            <TextInput
                label="Search"
                value={search}
                onChangeText={setSearch}
                style={styles.search}
                mode="outlined"
            />
            <FlatList
                data={filteredTemplates}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    search: {
        marginBottom: 16
    },
    
    item: {
        flexDirection: "row",
        marginBottom: 16
    },

    itemContent: {
        padding: 16,
        marginBottom: 16
    },

    itemTitle: {
        fontSize: 18
    }
})

export default TemplateList
