import { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import {
    EyeOutlined,
    EyeInvisibleOutlined,
    DownOutlined,
    RightOutlined,
    PlusOutlined,
    DeleteOutlined,
    CheckOutlined,
    CloseOutlined,
    BgColorsOutlined,
    MoonFilled,
    SunFilled,
    FolderOpenOutlined,
    BugOutlined,
    DownloadOutlined,
    UploadOutlined,
    ReloadOutlined,
    BulbOutlined,
    HighlightOutlined,
    EditOutlined,
    DeploymentUnitOutlined
} from '@ant-design/icons';
import Markdown from 'react-markdown'
import rehypeKatex from 'rehype-katex'
import remarkMath from 'remark-math'
import 'katex/dist/katex.min.css' // `rehype-katex` does not import the CSS for you
import {
    Button,
    Flex,
    Card,
    Divider,
    Typography,
    Dropdown,
    Modal,
    Form,
    Input,
    Space,
    ConfigProvider,
    Switch,
    Segmented,
    Upload,
    Layout,
    theme,
    Tabs,
    Table,
    Popover
} from "antd";
import styles from './App.module.css';
import {
    presetPalettes,
    presetDarkPalettes,
    presetPrimaryColors
} from '@ant-design/colors';
const CurrentMapContext = createContext(null);
const ModeThemeContext = createContext(null);
const MapLayoutContext = createContext(null);
const MapListContext = createContext(null)
const BackupListContext = createContext(null)

let radiusAmount = 12
let cardWidth = 200
let marginValue = 12
let neutralLightPalletes = ["#ffffff", "#fafafa", "#f5f5f5", "#f0f0f0", "#d9d9d9", "#bfbfbf", "#8c8c8c", "#595959", "#434343", "#262626"]
let neutralDarkPalletes = ["#262626", "#434343", "#595959", "#8c8c8c", "#bfbfbf", "#d9d9d9", "#f0f0f0", "#f5f5f5", "#fafafa", "#ffffff",]

function recursiveModify(currNode, idToModify, attrModify, contentToModify) {
    if (currNode.nodeID == idToModify) {
        currNode[attrModify] = contentToModify != null ? contentToModify : !currNode[attrModify]
        return true
    }
    else {
        for (let childNode of currNode.children) {
            let found = recursiveModify(childNode, idToModify, attrModify, contentToModify != null ? contentToModify : null)
            if (found) {
                return true
            }
        }
    }
}
function recursiveFindNode(currNode, idToModify) {
    if (currNode.nodeID == idToModify) {
        return currNode
    }
    else {
        for (let childNode of currNode.children) {
            let found = recursiveFindNode(childNode, idToModify)
            if (found) {
                return found
            }
        }
    }
}
function recursiveModifyTree(currNode, attrModify, contentToModify, conditionAtt) {
    if (conditionAtt == null || currNode[conditionAtt] != "") {
        currNode[attrModify] = contentToModify != null ? contentToModify : !currNode[attrModify]
    }
    for (let childNode of currNode.children) {
        recursiveModifyTree(childNode, attrModify, contentToModify != null ? contentToModify : null, conditionAtt)
    }
}
function generateRandomString(length = 10) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function toggleShowDescription(node, currentMap, setCurrentMap) {
    let cloneMap = JSON.parse(JSON.stringify(currentMap))
    recursiveModify(cloneMap, node.nodeID, "showDescription", null)
    setCurrentMap(cloneMap)
}
function toggleShowChildren(node, currentMap, setCurrentMap) {
    let cloneMap = JSON.parse(JSON.stringify(currentMap))
    recursiveModify(cloneMap, node.nodeID, "showChildren", null)
    setCurrentMap(cloneMap)
}

function findAndPopNode(currNode, idToFind) {
    const index = currNode.children.findIndex(obj => obj.nodeID === idToFind);
    if (index !== -1) {
        return currNode.children.splice(index, 1)[0]; // removes and returns the object
    }
    else {
        for (let childNode of currNode.children) {
            let result = findAndPopNode(childNode, idToFind)
            if (result != null) {
                return result
            }
        }
    }
}

function findAndMoveNode(currNode, nodeToMove, idToFind) {
    const index = currNode.children.findIndex(obj => obj.nodeID === idToFind);
    if (index !== -1) {
        currNode.children.splice(index, 0, nodeToMove)
        return true
    }
    else {
        for (let childNode of currNode.children) {
            let result = findAndMoveNode(childNode, nodeToMove, idToFind)
            if (result != null) {
                return result
            }
        }
    }
}

function handleMoveNode(id1, id2, currentMap, setCurrentMap) {
    if (id1 != currentMap.nodeID && id2 != currentMap.nodeID) {
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        let nodeToMove = findAndPopNode(cloneMap, id1)
        findAndMoveNode(cloneMap, nodeToMove, id2)
        setCurrentMap(cloneMap)
    }
}
function newNodeTemplate(color) {
    return {
        "nodeID": generateRandomString(),
        "nodeName": "New Node",
        "nodeDescription": "",
        "edgeName": "",
        "nodeColor": color ? color : "neutral",
        "showDescription": false,
        "showChildren": true,
        "children": []
    }
}
function handleExpandTree(node, currentMap, setCurrentMap) {
    let cloneMap = JSON.parse(JSON.stringify(currentMap))
    let foundNode = recursiveFindNode(cloneMap, node.nodeID)
    recursiveModifyTree(foundNode, "showChildren", !node.showChildren)
    setCurrentMap(cloneMap)
}
function handleShowTree(node, currentMap, setCurrentMap) {
    let cloneMap = JSON.parse(JSON.stringify(currentMap))
    let foundNode = recursiveFindNode(cloneMap, node.nodeID)
    recursiveModifyTree(foundNode, "showDescription", !node.showDescription, "nodeDescription")
    setCurrentMap(cloneMap)
}


const LeftLine = ({ node, nodeType, childrenLength }) => {
    let antdTheme = theme.useToken()
    let { mapLayout, setMapLayout } = useContext(MapLayoutContext)
    let lineColor = antdTheme.token.colorTextTertiary
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    let showBorder = nodeType == "root" ? false : true
    let hideLeftBorder = mapLayout == "spider" && childrenLength == 1
    return (
        <>
            <Flex className='LeftLine' align='center' style={{ minWidth: cardWidth / 2 }}>
                <div style={{ display: "flex", flex: 1, flexDirection: "column", minHeight: "100%" }}>
                    <div onClick={(e) => {
                        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                            handleExpandTree(node, currentMap, setCurrentMap)
                        }
                    }} style={{
                        caretColor: "transparent", cursor: "pointer", flex: 1,
                        borderBottom: showBorder && nodeType == "bot" ? `1px solid ${lineColor}` : "",
                        borderLeft: showBorder && nodeType != "top" && !hideLeftBorder ? `1px solid ${lineColor}` : "",
                        borderRadius: showBorder && nodeType == "bot" ? `0 0 0 ${radiusAmount}px` : ""
                    }}>

                    </div>
                    <div onClick={(e) => {
                        if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                            handleShowTree(node, currentMap, setCurrentMap)
                        }
                    }} style={{
                        caretColor: "transparent", cursor: "pointer", flex: 1,
                        borderTop: showBorder && nodeType != "bot" ? `1px solid ${lineColor}` : "",
                        borderLeft: showBorder && nodeType != "bot" && !hideLeftBorder ? `1px solid ${lineColor}` : "",
                        borderRadius: showBorder && nodeType == "top" ? `${radiusAmount}px 0 0 0` : ""
                    }}>
                    </div>
                </div>
                {node.children.length > 0 ? <Button onClick={(e) => {
                    if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                        toggleShowChildren(node, currentMap, setCurrentMap)
                    }
                }} className='expandButton' icon={node.showChildren ? <DownOutlined /> : <RightOutlined />} type='text' size='small' /> : <></>}
            </Flex>
        </>
    )
}

const EdgeComp = ({ node, showEdgeForm, setShowEdgeForm }) => {
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    function handleRenameEdge(query) {
        const newName = query[`edgeName ${node.nodeID}`]
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        recursiveModify(cloneMap, node.nodeID, "edgeName", newName)
        setShowEdgeForm(false)
        setCurrentMap(cloneMap)
    }
    function handleEscapeEdgeNameForm(e) {
        if (e.key === "Escape") {
            setShowEdgeForm(false)
        }
    }
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    return (
        <>
            {
                showEdgeForm ? <Form
                    name={generateRandomString()}
                    wrapperCol={{ span: 24 }}
                    initialValues={{ [`edgeName ${node.nodeID}`]: node.edgeName, remember: true }}
                    onFinish={handleRenameEdge}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={{ padding: 6, maxWidth: cardWidth }}
                >
                    <Form.Item
                        name={`edgeName ${node.nodeID}`}
                        style={{ marginBottom: 0, width: "100%" }}
                    >
                        <Input autoFocus onKeyDown={handleEscapeEdgeNameForm} />
                    </Form.Item>
                </Form>
                    :
                    <div className='edgeform' style={{ width: "100%", padding: `0 4px`, height: "100%", display: "flex", alignItems: "flex-end" }} onDoubleClick={() => { setShowEdgeForm(true) }}>
                        <Typography.Text style={{ fontSize: 12 }}>{node.edgeName}</Typography.Text>

                    </div>
            }
        </>
    )
}

const NodeCard = ({ node, setShowEdgeForm }) => {
    let antdTheme = theme.useToken()
    const [form] = Form.useForm();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    const { modeTheme, setModeTheme } = useContext(ModeThemeContext);
    let [showDescriptionForm, setShowDescriptionForm] = useState(false)
    let [showNodeNameForm, setShowNodeNameForm] = useState(false)
    let lineColor = antdTheme.token.colorTextTertiary
    const showModal = () => {
        setIsModalOpen(true);
    };
    let backgroundIndex = 1
    let borderIndex = 8
    let colorPalettes = modeTheme == "light" ? presetPalettes : presetDarkPalettes
    let neutralPalletes = modeTheme == "light" ? neutralLightPalletes : neutralDarkPalletes
    const contextMenuItems = [
        {
            key: 'Node',
            label: (
                <Typography.Text>
                    Node
                </Typography.Text>
            ),
            icon: <PlusOutlined />,
            onClick: addChild
        },
        // {
        //     key: 'Description',
        //     label: (
        //         <Typography.Text>
        //             Description
        //         </Typography.Text>
        //     ),
        //     icon: <EditOutlined />,
        //     onClick: () => {
        //         toggleShowDescription(node, currentMap, setCurrentMap)
        //         setShowDescriptionForm(true)
        //     }
        // },
        {
            key: 'Edge',
            label: (
                <Typography.Text>
                    Edge
                </Typography.Text>
            ),
            icon: <DeploymentUnitOutlined />,
            onClick: () => {
                setShowEdgeForm(true)
            }
        },

        {
            key: 'Color',
            label: 'Color',
            icon: <HighlightOutlined />,
            children: [
                {
                    key: 'neutral',
                    label: <div style={{ caretColor: "transparent", backgroundColor: neutralPalletes[backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'red',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["red"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'orange',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["orange"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'yellow',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["yellow"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'green',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["green"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'cyan',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["cyan"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'blue',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["blue"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'purple',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["purple"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'magenta',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["magenta"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorNode
                },
            ],
        },
        {
            key: 'Fill',
            label: 'Fill',
            icon: <BgColorsOutlined />,
            children: [
                {
                    key: 'fill_neutral',
                    label: <div style={{ caretColor: "transparent", backgroundColor: neutralPalletes[backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorTree
                },
                {
                    key: 'fill_red',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["red"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorTree
                },
                {
                    key: 'fill_orange',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["orange"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorTree
                },
                {
                    key: 'fill_yellow',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["yellow"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorTree
                },
                {
                    key: 'fill_green',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["green"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorTree
                },
                {
                    key: 'fill_cyan',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["cyan"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorTree
                },
                {
                    key: 'fill_blue',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["blue"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorTree
                },
                {
                    key: 'fill_purple',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["purple"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorTree
                },
                {
                    key: 'fill_magenta',
                    label: <div style={{ caretColor: "transparent", backgroundColor: colorPalettes["magenta"][backgroundIndex], borderRadius: radiusAmount, height: 22, width: 50 }}></div>,
                    onClick: handleReColorTree
                },
            ],
        },
        {
            key: 'Delete',
            label: 'Delete',
            danger: true,
            icon: <DeleteOutlined />,
            onClick: showModal
        },
    ];
    function handleRenameNode(query) {
        const newName = query[`nodeName ${node.nodeID}`]
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        recursiveModify(cloneMap, node.nodeID, "nodeName", newName)
        setShowNodeNameForm(false)
        setCurrentMap(cloneMap)
    }
    function handleRewriteDescription(query) {
        const newDes = query[`nodeDescription ${node.nodeID}`];
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        recursiveModify(cloneMap, node.nodeID, "nodeDescription", newDes)
        setShowDescriptionForm(false)
        setCurrentMap(cloneMap)
    }
    function recursiveAddChild(currNode, idToModify) {
        if (currNode.nodeID == idToModify) {
            let newNode = newNodeTemplate(currNode.nodeColor)
            currNode.children.push(newNode)
            currNode.showChildren = true
            return true
        }
        else {
            for (let childNode of currNode.children) {
                let found = recursiveAddChild(childNode, idToModify)
                if (found) {
                    return true
                }
            }
        }
    }
    function recursiveAddSibling(currNode, idToModify) {
        const index = currNode.children.findIndex(item => item.nodeID === idToModify);
        if (index !== -1) {
            let newNode = newNodeTemplate(currNode.nodeColor)
            currNode.children.splice(index + 1, 0, newNode);
            return true
        }
        else {
            for (let childNode of currNode.children) {
                let found = recursiveAddSibling(childNode, idToModify)
                if (found) {
                    return true
                }
            }
        }
    }
    function recursiveDeleteNode(currNode, idToDelete) {
        const index = currNode.children.findIndex(item => item.nodeID === idToDelete);
        if (index !== -1) {
            currNode.children.splice(index, 1);
            return true
        }
        else {
            for (let childNode of currNode.children) {
                let found = recursiveDeleteNode(childNode, idToDelete)
                if (found) {
                    return true
                }
            }
        }
    }
    function addChild() {
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        recursiveAddChild(cloneMap, node.nodeID)
        setCurrentMap(cloneMap)
    }
    function addSibling() {
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        recursiveAddSibling(cloneMap, node.nodeID)
        setCurrentMap(cloneMap)
    }
    function handleDeleteNode() {
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        recursiveDeleteNode(cloneMap, node.nodeID)
        setIsModalOpen(false)
        setCurrentMap(cloneMap)
    }
    function handleReColorNode(e) {
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        recursiveModify(cloneMap, node.nodeID, "nodeColor", `${e.key}`)
        setCurrentMap(cloneMap)
    }
    function handleReColorTree(e) {
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        let foundNode = recursiveFindNode(cloneMap, node.nodeID)
        recursiveModifyTree(foundNode, "nodeColor", `${e.key.replace("fill_", "")}`)
        setCurrentMap(cloneMap)
    }
    const onFinishFailed = errorInfo => {
        console.log('Failed:', errorInfo);
    };
    function handleEscapeNodeNameForm(e) {
        if (e.key === "Escape") {
            setShowNodeNameForm(false)
        }
    }
    function handleDragStart(e) {
        // e.preventDefault()
        e.dataTransfer.setData("currentNode", node.nodeID);
    }
    function preventDragDefault(e) {
        e.preventDefault()
    }
    function handleDrop(e) {
        e.preventDefault()
        let nodeToMoveID = e.dataTransfer.getData("currentNode")
        let currentNodeID = node.nodeID
        if (nodeToMoveID !== currentNodeID && currentNodeID !== currentMap.nodeID) {
            handleMoveNode(nodeToMoveID, currentNodeID, currentMap, setCurrentMap)
        }

    }
    const handlePaste = (e) => {
        e.preventDefault();

        // Get the pasted text from clipboard
        const pastedText = e.clipboardData.getData('text');

        // Remove all newlines (both \n and \r\n) and replace with spaces
        const cleanedText = pastedText.replace(/[\r\n]+/g, ' ');

        // Get current cursor position
        const textarea = e.target;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;

        // Get current value
        const currentValue = textarea.value;

        // Insert cleaned text at cursor position
        const newValue = currentValue.substring(0, start) + cleanedText + currentValue.substring(end);

        // Update the form field value
        const fieldName = `nodeDescription ${node.nodeID}`;
        form.setFieldsValue({ [fieldName]: newValue });

        // Set cursor position after the pasted text
        setTimeout(() => {
            textarea.setSelectionRange(start + cleanedText.length, start + cleanedText.length);
        }, 0);
    };
    const handleSubmitDescription = (e) => {
        if (e.ctrlKey && e.key === 'Enter') {
            e.preventDefault();
            form.submit();
        }
    };
    return (
        <>
            <Dropdown menu={{ items: contextMenuItems }} trigger={'contextMenu'}>
                <div draggable={!node.showDescription}
                    onDragStart={handleDragStart}
                    onDragOver={preventDragDefault}
                    onDragEnter={preventDragDefault}
                    onDragLeave={preventDragDefault}
                    onDrag={preventDragDefault}
                    onDragEnd={preventDragDefault}
                    onDrop={handleDrop}>
                    <Card
                        size={"small"}
                        onClick={(e) => {
                            if (e.shiftKey) {
                                addSibling()
                            }
                        }}
                        style={{
                            cursor: "pointer",
                            borderColor: node.nodeColor == "neutral" ? neutralPalletes[borderIndex] : colorPalettes[node.nodeColor][borderIndex],
                            minWidth: node.showDescription ? 400 : cardWidth,
                            maxWidth: 400,
                            maxHeight: 400,
                            height: "auto",
                            minHeight: 50,
                            // height: node.showDescription ? 400 : 50,
                            backgroundColor: node.nodeColor == "neutral" ? neutralPalletes[backgroundIndex] : colorPalettes[node.nodeColor][backgroundIndex],
                            // color: node.nodeColor == "Default" ? antdTheme.token.colorText : antdTheme.token[`color${node.nodeColor}TextActive`],
                            // transition: "width 0.3s, height 0.3s",
                            color: antdTheme.token.colorText
                        }}
                        styles={{
                            body: {
                                maxHeight: 400 - antdTheme.token.paddingSM,
                                display: 'flex', flexDirection: 'column'
                            }
                        }}

                    >
                        {
                            showNodeNameForm ? <Form
                                name={generateRandomString()}
                                wrapperCol={{ span: 24 }}
                                initialValues={{ [`nodeName ${node.nodeID}`]: node.nodeName, remember: true }}
                                onFinish={handleRenameNode}
                                onFinishFailed={onFinishFailed}
                                autoComplete="off">
                                <Space.Compact style={{ width: '100%' }}>
                                    <Form.Item
                                        name={`nodeName ${node.nodeID}`}
                                        style={{ marginBottom: 0, width: "100%" }}
                                    >
                                        <Input autoFocus onKeyDown={handleEscapeNodeNameForm} />
                                    </Form.Item>
                                    {node.showDescription ? <Form.Item style={{ marginBottom: 0 }}>
                                        <Button onClick={() => { setShowNodeNameForm(false) }} icon={<CloseOutlined />} />
                                    </Form.Item> : <></>}

                                    <Form.Item style={{ marginBottom: 0 }}>
                                        <Button htmlType='submit' type='primary' icon={<CheckOutlined />} />
                                    </Form.Item>

                                </Space.Compact>
                            </Form>
                                :
                                <Flex justify='space-between' align='center' gap={4}>
                                    <Typography.Text strong style={{ color: "inherit", flex: 1, whiteSpace: "nowrap" }}
                                        // onClick={(e) => {
                                        //     if (e.shiftKey) {
                                        //         setShowNodeNameForm(true)
                                        //     }
                                        // }}

                                        onDoubleClick={() => { setShowNodeNameForm(true) }}
                                    >{node.nodeName}</Typography.Text>
                                    <Button style={{ borderWidth: 0 }} type='text' shape='circle' size='small' onClick={(e) => {
                                        if (!e.shiftKey && !e.ctrlKey) {
                                            toggleShowDescription(node, currentMap, setCurrentMap)
                                        }
                                    }} icon={node.nodeDescription != "" ? <BulbOutlined /> : <></>}>
                                    </Button>
                                </Flex>
                        }
                        {
                            node.showDescription ?
                                <>
                                    <Divider size='large' style={{ margin: `${antdTheme.token.paddingSM}px 0`, borderColor: antdTheme.token.colorTextQuaternary }} />
                                    {showDescriptionForm ?
                                        <Form
                                            form={form}
                                            name={generateRandomString()}
                                            wrapperCol={{ span: 24 }}
                                            initialValues={{ [`nodeDescription ${node.nodeID}`]: node.nodeDescription, remember: true }}
                                            onFinish={handleRewriteDescription}
                                            onFinishFailed={onFinishFailed}
                                            autoComplete="off"
                                        >
                                            <Form.Item
                                                name={`nodeDescription ${node.nodeID}`}
                                                style={{ marginBottom: antdTheme.token.paddingSM }}
                                            >
                                                <Input.TextArea autoFocus autoSize={{
                                                    maxRows: 12
                                                }}
                                                    onPaste={handlePaste}
                                                    onKeyDown={handleSubmitDescription}
                                                />
                                            </Form.Item>
                                            <Form.Item style={{ marginBottom: 0 }}>
                                                <Flex justify='flex-end' gap={antdTheme.token.paddingSM}>
                                                    <Button onClick={() => { setShowDescriptionForm(false) }}>
                                                        Cancel
                                                    </Button>
                                                    <Button type="primary" htmlType="submit">
                                                        Save
                                                    </Button>

                                                </Flex>
                                            </Form.Item>
                                        </Form>
                                        : <div id='outerMarkdown'
                                            // onClick={(e) => {
                                            //     if (e.shiftKey) {
                                            //         setShowDescriptionForm(!showDescriptionForm)
                                            //     }
                                            // }}
                                            onDoubleClick={() => { setShowDescriptionForm(true) }}
                                            style={{ overflowY: "auto", flex: 1, minHeight: 22 }}>
                                            <style>
                                                {`
                                        #outerMarkdown p {
                                            margin: 0px;
                                        }
                                    `}
                                            </style>
                                            <Markdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]} style={{ margin: 0 }}>
                                                {node.nodeDescription}
                                            </Markdown>
                                        </div>}
                                </>
                                : <></>
                        }
                    </Card>
                </div>
            </Dropdown>

            <Modal centered
                title="Do you want to delete this node?"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleDeleteNode}
                onCancel={() => { setIsModalOpen(false) }}
            >
                <div>
                    <Typography.Text>Node: </Typography.Text>
                    <Typography.Text mark>{node.nodeName}</Typography.Text>
                </div>
                <Typography.Text>All of its children will also be deleted</Typography.Text>
            </Modal>
        </>
    )
}

const FolderNode = ({ node, nodeType, childrenLength }) => {
    let antdTheme = theme.useToken()
    let lineColor = antdTheme.token.colorTextTertiary
    const [showEdgeForm, setShowEdgeForm] = useState(false)
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    return (
        <>
            <div>
                <div style={{ caretColor: "transparent", borderLeft: nodeType == 'root' ? '' : `1px solid ${lineColor}`, flex: 1, minHeight: marginValue / 2, width: cardWidth }} />
                <Flex>
                    {/* <Flex align='center' style={{ width: cardWidth / 2 }}>
                        <div className='LeftLine' style={{ display: "flex", flex: 1, flexDirection: "column", minHeight: "100%" }}>
                            <div onClick={(e) => {
                                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                                    toggleShowChildren(node, currentMap, setCurrentMap)
                                }
                            }} style={{
                                caretColor: "transparent", cursor: "pointer", flex: 1,
                                borderBottom: nodeType == "bot" ? `1px solid ${lineColor}` : "",
                                borderLeft: nodeType != "root" ? `1px solid ${lineColor}` : "",
                                borderRadius: nodeType == "bot" ? `0 0 0 ${radiusAmount}px` : ""
                            }}>

                            </div>
                            <div onClick={(e) => {
                                if (!e.ctrlKey && !e.altKey && !e.shiftKey) {
                                    toggleShowChildren(node, currentMap, setCurrentMap)
                                }
                            }} style={{
                                caretColor: "transparent", cursor: "pointer", flex: 1,
                                borderTop: nodeType == "top" || nodeType == "mid" ? `1px solid ${lineColor}` : "",
                                borderLeft: nodeType == "top" || nodeType == "mid" ? `1px solid ${lineColor}` : "",
                                // borderRadius: nodeType == "top" ? `${radiusAmount}px 0 0 0` : ""
                            }}>
                            </div>
                        </div>
                        {node.children.length > 0 ? <Button onClick={() => { handleExpandTree(node, currentMap, setCurrentMap) }} className='expandButton' icon={node.showChildren ? <DownOutlined /> : <RightOutlined />} type='text' size='small' /> : <></>}
                    </Flex> */}
                    <LeftLine node={node} nodeType={nodeType} childrenLength={childrenLength} />
                    <NodeCard node={node} setShowEdgeForm={setShowEdgeForm} />
                </Flex>
                {
                    node?.children?.length > 0 && node?.showChildren ?
                        <>
                            <div style={{ paddingLeft: cardWidth, caretColor: "transparent", minHeight: marginValue, minWidth: cardWidth / 2, borderLeft: nodeType == 'root' || nodeType == 'bot' ? '' : `1px solid ${lineColor}` }}>
                                <div className='edgeborder' style={{ borderLeft: `1px solid ${lineColor}`, minHeight: marginValue / 2 }}>
                                    <EdgeComp node={node} showEdgeForm={showEdgeForm} setShowEdgeForm={setShowEdgeForm} />
                                </div>
                                {node.children.map((child, index) => {
                                    if (index < node.children.length - 1) {
                                        return (
                                            <FolderNode key={child.nodeID} node={child} nodeType={"mid"} childrenLength={node.children.length} />
                                        )
                                    }
                                }
                                )}
                                <FolderNode node={node.children[node.children.length - 1]} nodeType={"bot"} childrenLength={node.children.length} />
                            </div>
                        </>
                        : <div className="borderCheck" style={{ caretColor: "transparent", borderLeft: nodeType == 'bot' || nodeType == 'root' ? '' : `1px solid ${lineColor}`, minHeight: marginValue / 2, width: cardWidth }} />
                }
            </div >
        </ >
    )
}

const SpiderNode = ({ node, nodeType, childrenLength }) => {
    let antdTheme = theme.useToken()
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    const [showEdgeForm, setShowEdgeForm] = useState(false)
    let lineColor = antdTheme.token.colorTextTertiary
    return (
        <>
            <Flex className='SpiderNode'>
                <Flex vertical className='leftSection'>
                    <div style={{ caretColor: "transparent", borderLeft: nodeType == 'top' || nodeType == 'root' || childrenLength == 1 ? "" : `1px solid ${lineColor}`, flex: 1, minHeight: marginValue / 2 }} />
                    <Flex className='flexTest'>
                        {/* <Flex className='SpiderLeftLine' vertical={true} style={{ minWidth: cardWidth / 2, minHeight: "100%" }}>
                            <div onClick={(e) => {
                                if (!e.shiftKey && !e.ctrlKey) {
                                    toggleShowChildren(node, currentMap, setCurrentMap)
                                }
                            }} style={{
                                caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                                borderBottom: nodeType == "bot" && nodeType != "root" ? `1px solid ${lineColor}` : "",
                                borderLeft: nodeType != "top" && childrenLength > 1 && nodeType != "root" ? `1px solid ${lineColor}` : "",
                                borderRadius: nodeType == "bot" ? `0 0 0 ${radiusAmount}px` : ""
                            }}>

                            </div>
                            <div onClick={(e) => {
                                if (!e.shiftKey && !e.ctrlKey) {
                                    toggleShowChildren(node, currentMap, setCurrentMap)
                                }
                            }} style={{
                                caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                                borderTop: nodeType != "bot" && nodeType != "root" ? `1px solid ${lineColor}` : "",
                                borderLeft: nodeType != "bot" && nodeType != "root" && childrenLength > 1 ? `1px solid ${lineColor}` : "",
                                borderRadius: nodeType == "top" ? `${radiusAmount}px 0 0 0` : ""
                            }}>
                            </div>
                        </Flex> */}

                        <LeftLine node={node} nodeType={nodeType} childrenLength={childrenLength} />
                        <NodeCard node={node} setShowEdgeForm={setShowEdgeForm} />
                        {node.children.length > 0 && node.showChildren ?
                            <Flex className='RightLine' vertical={true} style={{ minWidth: cardWidth / 2 }}>
                                <div style={{
                                    caretColor: "transparent", flex: 1, minWidth: cardWidth / 2, display: "flex", alignItems: "flex-end"
                                }}>
                                    <EdgeComp node={node} showEdgeForm={showEdgeForm} setShowEdgeForm={setShowEdgeForm} />
                                </div>
                                <div style={{ caretColor: "transparent", flex: 1, minWidth: cardWidth / 2, borderTop: `1px solid ${lineColor}` }}>
                                </div>
                            </Flex>
                            : <></>}
                    </Flex>
                    <div style={{ caretColor: "transparent", borderLeft: nodeType == 'bot' || nodeType == 'root' || childrenLength == 1 ? "" : `1px solid ${lineColor}`, flex: 1, minHeight: marginValue / 2 }} />
                </Flex>
                {/* {node.children.length > 0 && node.showChildren ?
                    <Flex className='RightLine' vertical={true} style={{ minWidth: cardWidth / 2 }}>
                        <div style={{
                            caretColor: "transparent", flex: 1, minWidth: cardWidth / 2, display: "flex", alignItems: "flex-end"
                        }}>
                            <EdgeComp node={node} showEdgeForm={showEdgeForm} setShowEdgeForm={setShowEdgeForm} />
                        </div>
                        <div style={{ caretColor: "transparent", flex: 1, minWidth: cardWidth / 2, borderTop: `1px solid ${lineColor}` }}>
                        </div>
                    </Flex>
                    : <></>} */}
                {
                    node.children.length > 0 && node.showChildren ?
                        <>
                            <Flex vertical justify='center'>
                                {/* top child */}
                                {node.children.length > 1 ?
                                    <SpiderNode node={node.children[0]} nodeType={"top"} childrenLength={node.children.length} />
                                    : <></>}
                                {/* mid child */}
                                {/* {node.children.length > 1 ? <div style={{ caretColor: "transparent", minHeight: "100%", borderLeft: `1px solid ${lineColor}` }} /> : <></>} */}
                                {
                                    node.children.map((child, index) => {
                                        if ((index != 0 && index != node.children.length - 1) || node.children.length == 1) {
                                            return (
                                                <SpiderNode key={child.nodeID} node={child} nodeType={"mid"} childrenLength={node.children.length} />
                                            )
                                        }
                                    }
                                    )
                                }
                                {/* bot child */}
                                {node.children.length >= 2 ?
                                    <SpiderNode node={node.children[node.children.length - 1]} nodeType={"bot"} childrenLength={node.children.length} /> : <></>}
                            </Flex>
                        </> :
                        <></>
                }
            </Flex >
        </>
    )
}

const ZoomPanWrapper = ({ children }) => {
    const [zoom, setZoom] = useState(1);
    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef(null);

    const handleWheel = useCallback((e) => {
        if (e.ctrlKey) {
            e.preventDefault();

            const rect = containerRef.current.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;

            // Calculate the point in the content space before zoom
            const beforeZoomX = (mouseX - pan.x) / zoom;
            const beforeZoomY = (mouseY - pan.y) / zoom;

            // Update zoom
            const delta = e.deltaY > 0 ? 0.9 : 1.1;
            const newZoom = Math.min(Math.max(zoom * delta, 0.1), 10);

            // Calculate new pan to keep the mouse point fixed
            const newPanX = mouseX - beforeZoomX * newZoom;
            const newPanY = mouseY - beforeZoomY * newZoom;

            setZoom(newZoom);
            setPan({ x: newPanX, y: newPanY });
        }
    }, [zoom, pan]);

    const handleMouseDown = useCallback((e) => {
        if (e.ctrlKey) {
            e.preventDefault();
            setIsDragging(true);
            setDragStart({
                x: e.clientX - pan.x,
                y: e.clientY - pan.y
            });
        }
    }, [pan]);

    const handleMouseMove = useCallback((e) => {
        if (isDragging && e.ctrlKey) {
            e.preventDefault();
            setPan({
                x: e.clientX - dragStart.x,
                y: e.clientY - dragStart.y
            });
        }
    }, [isDragging, dragStart]);

    const handleMouseUp = useCallback((e) => {
        setIsDragging(false);
    }, []);

    const handleKeyDown = useCallback((e) => {
        if (e.ctrlKey && e.key === '0') {
            e.preventDefault();
            setZoom(1);
            setPan({ x: 0, y: 0 });
        }
    }, []);

    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.addEventListener('wheel', handleWheel, { passive: false });
            return () => {
                container.removeEventListener('wheel', handleWheel);
            };
        }
    }, [handleWheel]);

    useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleMouseMove, handleMouseUp, handleKeyDown]);

    return (
        <div
            ref={containerRef}
            className="fixed inset-0 overflow-hidden bg-gray-100 cursor-grab"
            style={{
                cursor: isDragging ? 'grabbing' : (zoom > 1 ? 'grab' : 'default'),
                width: "100%", height: "100%"
            }}
            onMouseDown={handleMouseDown}
        >
            {/* Content container */}
            <div
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
                    transformOrigin: '0 0',
                    width: '100%',
                    height: '100%'
                }}
            >
                {children}
            </div>
        </div>
    );
};

const TableBackup = () => {
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    const { backupList, setBackupList } = useContext(BackupListContext);
    const { mapList, setMapList } = useContext(MapListContext);
    const [modalBackup, setModalBackup] = useState(false)
    const uploadProps = {
        accept: ".json", // Only allow JSON files
        showUploadList: false, // Hide default file list
        beforeUpload: (file) => {
            // Validate file type
            const isJson = file.type === "application/json" || file.name.endsWith(".json");
            if (!isJson) {
                return Upload.LIST_IGNORE;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    let cloneMapList = JSON.parse(JSON.stringify(mapList))
                    cloneMapList.push({
                        key: json.nodeID,
                        label: json.nodeName
                    })
                    setMapList(cloneMapList)
                    setCurrentMap(json)
                    setModalBackup(false)
                } catch (err) {

                }
            };
            reader.readAsText(file);

            // Prevent automatic upload
            return false;
        },
    };
    function loadBackup(mapToLoad) {
        let backupMaps = JSON.parse(localStorage.getItem("backupMaps"))
        let index = backupMaps.findIndex(item => item.nodeID == mapToLoad.nodeID)
        let cloneMapList = JSON.parse(JSON.stringify(mapList))
        cloneMapList.push({
            key: mapToLoad.nodeID,
            label: mapToLoad.nodeName
        })
        setMapList(cloneMapList)
        setCurrentMap(backupMaps[index])
        setModalBackup(false)
    }
    const editMapList = (targetKey, action) => {
        if (action === 'add') {
            setModalBackup(true)
        } else {
            let cloneMapList = JSON.parse(JSON.stringify(mapList))
            cloneMapList = cloneMapList.filter(item => item.key !== targetKey)
            let newCurrentMap = null
            if (cloneMapList.length > 0) {
                if (targetKey == currentMap.nodeID) {
                    let backupMaps = JSON.parse(localStorage.getItem("backupMaps"))
                    const index = backupMaps?.findIndex(obj => obj.nodeID === cloneMapList[0].key);
                    newCurrentMap = backupMaps[index]
                    setCurrentMap(newCurrentMap)
                }
                setMapList(cloneMapList)
            }
            else {
                setMapList([])
                setCurrentMap(null)
            }
        }
    };
    function createNewMap() {
        let newRoot = newNodeTemplate()
        // setModalNew(false)
        let cloneMapList = JSON.parse(JSON.stringify(mapList))
        cloneMapList.push({
            key: newRoot.nodeID,
            label: newRoot.nodeName
        })
        setMapList(cloneMapList)
        setCurrentMap(newRoot)
    }
    function deleteBackup(record) {
        let backupMaps = JSON.parse(localStorage.getItem("backupMaps"))
        let index = backupMaps.findIndex(item => item.nodeID == record.nodeID)
        backupMaps.splice(index, 1)
        localStorage.setItem("backupMaps", JSON.stringify(backupMaps))
        let cloneBackupList = JSON.parse(JSON.stringify(backupList))
        let index2 = cloneBackupList.findIndex(item => item.nodeID == record.nodeID)
        cloneBackupList.splice(index, 1)
        setBackupList(cloneBackupList)
    }

    function changeActiveTab(newNodeID) {
        let backupMaps = JSON.parse(localStorage.getItem("backupMaps"))
        const index = backupMaps?.findIndex(obj => obj.nodeID === newNodeID);
        setCurrentMap(backupMaps[index])
    }
    let tableColumn = [
        {
            title: 'Name',
            dataIndex: 'nodeName',
            key: 'nodeName',
            width: "30%",
            onCell: (record, rowIndex) => {
                return {
                    onClick: (event) => { loadBackup(record) }
                };
            },
            render: val => <Typography.Text>{val}</Typography.Text>,
        },
        {
            title: 'Description',
            dataIndex: 'nodeDescription',
            key: 'nodeDescription',
            onCell: (record, rowIndex) => {
                return {
                    onClick: (event) => { loadBackup(record) }
                };
            },
            ellipsis: true,
            width: "60%",
            render: val => <Typography.Text>{val}</Typography.Text>,
        },
        {
            title: '',
            key: 'action',
            width: "10%",
            render: (_, record) => (
                <Flex justify='flex-end' align='center'>
                    <Popover content={<>
                        <Typography.Text>Map: </Typography.Text>
                        <Typography.Text mark>{record.nodeName}</Typography.Text>
                        <Typography.Paragraph>This action is irreversible</Typography.Paragraph>
                        <Flex justify='flex-end'>
                            <Button danger type={"primary"} icon={<DeleteOutlined />} size='small' onClick={() => { deleteBackup(record) }}>Delete</Button>
                        </Flex>
                    </>} title="Are you sure you want to delete this backup map?" trigger={"click"}>
                        <Button danger type='text' icon={<DeleteOutlined />} size='small' />
                    </Popover>

                </Flex>
            ),
        },
    ]
    return <>
        <Tabs
            type="editable-card"
            onChange={changeActiveTab}
            activeKey={currentMap?.nodeID}
            onEdit={editMapList}
            items={mapList}
            tabBarStyle={{
                margin: 0
            }}
        />
        <Modal centered
            title="Open map"
            open={modalBackup}
            onCancel={() => { setModalBackup(false) }}
            footer={null}
            width={"50%"}
            style={{ caretColor: "transparent" }}
        >
            <Table expandable={{ expandIcon: () => <></> }}
                rowKey={"nodeID"}
                columns={tableColumn}
                dataSource={backupList}
                onRow={(record, rowIndex) => {
                    return {
                        style: {
                            cursor: "pointer"
                        }
                    };
                }}
            />
            <Flex justify='flex-end' align='center' gap={"small"} style={{ marginTop: backupList.length > 0 ? 0 : 20 }}>
                < Button onClick={() => {
                    createNewMap()
                    setModalBackup(false)
                }} variant="filled" color="default" icon={<PlusOutlined />}>
                    New map
                </Button >
                <Upload {...uploadProps}>
                    <Button variant='solid' color='default' icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Flex>
        </Modal >

    </>
}

const MindMap = () => {
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    const { modeTheme, setModeTheme } = useContext(ModeThemeContext);
    const { mapLayout, setMapLayout } = useContext(MapLayoutContext);
    const { mapList, setMapList } = useContext(MapListContext);

    const [expandAll, setExpandAll] = useState(false);
    const [showAll, setShowAll] = useState(false);
    let antdTheme = theme.useToken()
    let lineColor = antdTheme.token.colorTextTertiary
    let layoutMargin = 18
    function recursiveAll(currNode, currAtt, contentToModify, conditionAtt) {
        if (conditionAtt == null || currNode[conditionAtt] != "") {
            currNode[currAtt] = contentToModify != null ? contentToModify : !currNode[currAtt]
        }
        for (let child of currNode.children) {
            recursiveAll(child, currAtt, contentToModify != null ? contentToModify : null, conditionAtt)
        }
    }
    function handleExpandAll() {
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        recursiveAll(cloneMap, "showChildren", !expandAll)
        setExpandAll(!expandAll)
        setCurrentMap(cloneMap)
    }
    function handleShowAll() {
        let cloneMap = JSON.parse(JSON.stringify(currentMap))
        recursiveAll(cloneMap, "showDescription", !showAll, "nodeDescription")
        setShowAll(!showAll)
        setCurrentMap(cloneMap)
    }
    const downloadJson = () => {
        const jsonString = JSON.stringify(currentMap, null, 4); // formatted JSON
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = `${currentMap.nodeName}.json`; // filename
        link.click();

        URL.revokeObjectURL(url); // cleanup
    };

    return (
        <>
            <div className='layoutMenu' style={{
                margin: `0 ${layoutMargin}px`,
                height: 60,
                borderBottom: `1px solid ${lineColor}`,
                caretColor: "transparent"
            }}>
                <Flex align='center' justify='space-between' style={{ height: "100%" }}>

                    <Flex align='center' style={{ height: "100%" }}>
                        <img height={24} src={`${window.location.href}/logo_${modeTheme}.png`} onClick={() => { setCurrentMap(null) }} style={{ cursor: "pointer" }} />
                        {currentMap ? <Divider type='vertical' style={{ margin: `0 ${layoutMargin}px`, borderColor: lineColor, height: "64%" }} /> : <></>}
                        <Flex align='center' gap={12}>
                            {currentMap
                                ? <>
                                    <Button onClick={handleExpandAll} variant="filled" color='default' shape="default" icon={expandAll ? <DownOutlined /> : <RightOutlined />}>
                                        {expandAll ? "Collapse all" : "Expand all"}
                                    </Button>
                                    <Button onClick={handleShowAll} variant="filled" color='default' shape="default" icon={showAll ? <EyeInvisibleOutlined /> : <EyeOutlined />}>
                                        {showAll ? "Hide all" : "Show all"}
                                    </Button>
                                </>
                                : <>

                                </>
                            }
                        </Flex>
                        <Divider type='vertical' style={{ margin: `0 ${layoutMargin}px`, borderColor: lineColor, height: "64%" }} />
                        <TableBackup />
                    </Flex>
                    <Flex gap={'small'} align='center'>

                        {currentMap ?
                            <>
                                <Segmented
                                    block={false}
                                    size={"large"}
                                    // shape="round"
                                    onChange={(value) => setMapLayout(value)}
                                    options={[
                                        { value: 'spider', label: 'Spider layout', icon: <BugOutlined /> },
                                        { value: 'folder', label: 'Folder layout', icon: <FolderOpenOutlined /> },
                                    ]}
                                />
                                <Button color='default' variant='solid' onClick={downloadJson} shape="round" icon={<DownloadOutlined />}>
                                    Download
                                </Button>
                            </>
                            :
                            <></>
                        }
                        <Switch
                            checked={modeTheme == "light"}
                            unCheckedChildren={<MoonFilled />}
                            checkedChildren={<SunFilled />}
                            onClick={(checked, event) => {
                                if (checked) {
                                    localStorage.setItem("modeTheme", "light")
                                    setModeTheme("light")
                                }
                                else {
                                    localStorage.setItem("modeTheme", "dark")
                                    setModeTheme("dark")
                                }
                            }} />
                    </Flex>
                </Flex>
            </div>
            <div className='insideWrapper' style={{ flex: 1, width: "100%", overflowX: "hidden", overflowY: "auto", display: 'flex', justifyContent: "center", alignItems: "center" }}>
                {currentMap ?
                    <>
                        {
                            mapList.map((child, index) =>
                                <div key={child.key} style={{ display: child?.key == currentMap?.nodeID ? "block" : "none", width: "100%", height: "100%" }}>
                                    <ZoomPanWrapper>
                                        {child?.key == currentMap?.nodeID ? <>
                                            {
                                                mapLayout == "spider" ? <SpiderNode node={currentMap} nodeType={"root"} childrenLength={currentMap.children.length} /> : <></>
                                            }
                                            {
                                                mapLayout == "folder" ? <FolderNode node={currentMap} nodeType={"root"} childrenLength={currentMap.children.length} /> : <></>
                                            }
                                        </> : <></>}

                                    </ZoomPanWrapper>
                                </div>
                            )
                        }

                    </> : <Flex vertical align='center' justify='center' style={{ width: "100%", height: "100%", caretColor: "transparent" }}>
                        <img style={{ caretColor: "transparent" }} width={"30%"} src={`${window.location.href}/lotr_${modeTheme}.svg`} />
                        <Typography.Text className={styles.WandererComp} style={{ fontSize: 60 }}>not all those who wander are lost</Typography.Text>
                    </Flex>}
            </div>

        </>
    );
}

function App() {
    const [currentMap, setCurrentMap] = useState(null);
    let [modeTheme, setModeTheme] = useState("light")
    let [mapLayout, setMapLayout] = useState("spider")
    const [screen, setScreen] = useState(0);
    let [backupList, setBackupList] = useState([])
    let [mapList, setMapList] = useState([])
    useEffect(() => {
        const startTimers = () => {
            const timerA = setTimeout(() => setScreen(1), 1000);
            const timerB = setTimeout(() => setScreen(2), 4700);
            return () => {
                clearTimeout(timerA);
                clearTimeout(timerB);
            };
        };

        if (document.readyState === 'complete') {
            return startTimers();
        } else {
            const handleLoad = () => startTimers();
            window.addEventListener('load', handleLoad);
            return () => window.removeEventListener('load', handleLoad);
        }
    }, []);
    useEffect(() => {
        let modeThemeStorage = localStorage.getItem("modeTheme")
        let backupMaps = JSON.parse(localStorage.getItem('backupMaps'))
        if (modeThemeStorage == "dark") {
            localStorage.setItem("modeTheme", "dark")
            setModeTheme("dark")
        }
        else {
            localStorage.setItem("modeTheme", "light")
            setModeTheme("light")
        }
        if (!backupMaps) {
            localStorage.setItem("backupMaps", JSON.stringify([]))
            setBackupList([])
        }
        else {
            let newBackupMaps = backupMaps.map(child => {
                return {
                    nodeID: child.nodeID,
                    nodeName: child.nodeName,
                    nodeDescription: child.nodeDescription
                }
            })
            setBackupList(newBackupMaps)
        }
        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);

        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);
    useEffect(() => {
        if (currentMap != null) {
            let backupMaps = JSON.parse(localStorage.getItem('backupMaps'))
            const index = backupMaps?.findIndex(obj => obj.nodeID === currentMap.nodeID);
            if (index != -1) {
                backupMaps.splice(index, 1, currentMap)
                localStorage.setItem('backupMaps', JSON.stringify(backupMaps))
            }
            else {
                backupMaps.push(currentMap)
                localStorage.setItem('backupMaps', JSON.stringify(backupMaps))
            }
        }
    }, [currentMap])
    useEffect(() => {
        if (currentMap) {
            let cloneMapList = JSON.parse(JSON.stringify(mapList))
            let index = cloneMapList.findIndex(item => item.key == currentMap.nodeID)
            cloneMapList.splice(index, 1, {
                key: currentMap.nodeID,
                label: currentMap.nodeName
            })
            setMapList(cloneMapList)
        }
    }, [currentMap?.nodeName])
    useEffect(() => {
        if (mapList && backupList) {
            const mapSet = new Set(mapList.map(item => item.key));
            let cloneBackupList = JSON.parse(localStorage.getItem("backupMaps"))
            const newBackupList = cloneBackupList.filter(item => !mapSet.has(item.nodeID));
            setBackupList(newBackupList)
        }
    }, [mapList?.length])
    return (
        <>
            <ConfigProvider theme={{
                algorithm: modeTheme == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm,
                // token: {
                //     colorPrimary: "#000000"
                // }
            }}>
                <ModeThemeContext.Provider value={{ modeTheme, setModeTheme }}>
                    <BackupListContext.Provider value={{ backupList, setBackupList }}>
                        <MapListContext.Provider value={{ mapList, setMapList }}>
                            <MapLayoutContext.Provider value={{ mapLayout, setMapLayout }}>
                                <CurrentMapContext.Provider value={{ currentMap, setCurrentMap }}>
                                    {screen != 2 ?
                                        <div style={{ height: "100%", width: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                            {screen == 1 ? <img src={`${window.location.href}/logo_motion.gif`} /> : <></>}

                                        </div> : <></>}
                                    <div style={{ height: "100%", width: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Layout
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                                padding: 0,
                                                display: "flex",
                                                flexDirection: "column",
                                                transition: "opacity 1s ease", opacity: screen == 2 ? 1 : 0
                                            }}
                                        ><MindMap /></Layout>
                                    </div>
                                    {/* <div style={{ height: "100%", width: "100%", backgroundColor: "black", display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Layout
                                            style={{
                                                height: "100%",
                                                width: "100%",
                                                padding: 0,
                                                display: "flex",
                                                flexDirection: "column",
                                                // transition: "opacity 1s ease", opacity: screen == 2 ? 1 : 0
                                            }}
                                        ><MindMap /></Layout>
                                    </div> */}
                                </CurrentMapContext.Provider>
                            </MapLayoutContext.Provider>
                        </MapListContext.Provider>
                    </BackupListContext.Provider>
                </ModeThemeContext.Provider>
            </ConfigProvider>
        </>
    );
}

export default App;
