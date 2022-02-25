import React, { useState } from "react"
import { FlatList, Platform, StyleSheet, TouchableOpacity, View } from "react-native"
import { TextInput } from "react-native-paper"
import FastImage from "react-native-fast-image"
import { useSharedContext, TemplateMeta, useModule } from "@meme-bros/client-lib"
import { useFilteredTemplates } from "./utils/filter"
import { useNavigate } from "react-router-native"

const MIN_IMAGE_WIDTH = 70

const Item = React.memo(({ template, onLoad, size }: {
    template: TemplateMeta,
    onLoad: () => void,
    size: number
}) => {
    const { getPreviewURI } = useModule("templates")

    const margin = 1

    const width = size - margin * 2
    const height = size - margin * 2

    return (
        <View style={{ flex: 1, flexDirection: "column", margin }}>
            <TouchableOpacity onPress={onLoad}>
                <FastImage
                    source={{ uri: getPreviewURI(template) }}
                    style={{ width, height }}
                    width={width}
                    height={height}
                />
            </TouchableOpacity>
        </View>
    )
})

function TemplateList({ templates }: {
    templates: TemplateMeta[]
}) {
    const context = useSharedContext()

    const navigate = useNavigate()
    
    const { getCanvas } = useModule("templates")

    const { width } = useModule("view").useDimensions()

    const [search, setSearch] = useState("")

    const filteredTemplates = useFilteredTemplates({ templates, search })

    const numColumns = Math.floor(width / MIN_IMAGE_WIDTH)

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
                size={width / numColumns}
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
                numColumns={numColumns}
                key={numColumns}
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
