import React, { useState } from "react"
import { FlatList, Platform, StyleSheet, View } from "react-native"
import { Text, Surface, IconButton, TextInput } from "react-native-paper"
import Image from "react-native-scalable-image"
import { useSharedContext, TemplateMeta, useModule } from "@meme-bros/client-lib"
import { useFilteredTemplates } from "./utils/filter"
import { useNavigate } from "react-router-native"

const Item = React.memo(({ template, onLoad }: {
    template: TemplateMeta,
    onLoad: () => void
}) => {
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
})

function TemplateList({ templates }: {
    templates: TemplateMeta[]
}) {
    const context = useSharedContext()

    const navigate = useNavigate()
    
    const { getCanvas } = useModule("templates")

    const [search, setSearch] = useState("")

    const filteredTemplates = useFilteredTemplates({ templates, search })

    const loadTemplate = async (template: TemplateMeta) => {
        const canvas = await getCanvas(template)
        context.events.emit("template.load", { template, canvas })
        navigate("/editor")
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
        // FIXME: Fix hardcoded view height for web
        <View style={{ height: Platform.OS === "web" ? 600 : undefined }}>
            <FlatList
                data={filteredTemplates}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                ListHeaderComponent={
                    <TextInput
                        label="Search"
                        value={search}
                        onChangeText={setSearch}
                        style={styles.search}
                        mode="outlined"
                    />
                }
            />
        </View>
    )
}

const styles = StyleSheet.create({
    search: {
        marginTop: 8,
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
