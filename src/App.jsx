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
    ReloadOutlined
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
    theme
} from "antd";



const CurrentMapContext = createContext(null);
const ModeThemeContext = createContext(null);

let radiusAmount = 12
let cardWidth = 200
let marginValue = 12


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
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz01234569';
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
function newNodeTemplate() {
    return {
        "nodeID": generateRandomString(10),
        "nodeName": "New Node",
        "nodeDescription": "",
        "edgeName": "",
        "nodeColor": "Default",
        "showDescription": false,
        "showChildren": true,
        "children": []
    }
}


const LeftLine = ({ node, nodeType }) => {
    let antdTheme = theme.useToken()
    let lineColor = antdTheme.token.colorTextTertiary
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    return (
        <>
            <Flex className='LeftLine' vertical={true} style={{ minWidth: cardWidth / 2, minHeight: "100%" }}>
                <div onClick={() => { toggleShowDescription(node, currentMap, setCurrentMap) }} style={{
                    caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                    borderBottom: nodeType == "bot" ? `1px solid ${lineColor}` : "",
                    borderLeft: nodeType == "bot" || nodeType == "mid" ? `1px solid ${lineColor}` : "",
                    borderRadius: nodeType == "bot" ? `0 0 0 ${radiusAmount}px` : ""
                }}>

                </div>
                <div onClick={() => { toggleShowChildren(node, currentMap, setCurrentMap) }} style={{
                    caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                    borderTop: (nodeType == "top" || nodeType == "mid" || nodeType == "topFolder") ? `1px solid ${lineColor}` : "",
                    borderLeft: nodeType == "top" || nodeType == "mid" ? `1px solid ${lineColor}` : "",
                    borderRadius: nodeType == "top" ? `${radiusAmount}px 0 0 0` : ""
                }}>
                </div>
            </Flex>
        </>
    )
}

const EdgeComp = ({ node }) => {
    const [showEdgeForm, setShowEdgeForm] = useState(false)
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
                    name="basic"
                    wrapperCol={{ span: 24 }}
                    initialValues={{ [`edgeName ${node.nodeID}`]: node.edgeName, remember: true }}
                    onFinish={handleRenameEdge}
                    onFinishFailed={onFinishFailed}
                    autoComplete="off"
                    style={{ margin: 4 }}
                >
                    <Form.Item
                        name={`edgeName ${node.nodeID}`}
                        style={{ marginBottom: 0, width: "100%" }}
                    >
                        <Input autoFocus onKeyDown={handleEscapeEdgeNameForm} />
                    </Form.Item>
                </Form>
                    :
                    <div style={{ minHeight: marginValue, margin: `0 4px 4px 4px`, width: "100%" }} onDoubleClick={() => { setShowEdgeForm(true) }}>
                        <Typography.Text style={{ fontSize: 12 }}>{node.edgeName}</Typography.Text>

                    </div>
            }
        </>
    )
}

const NodeCard = ({ node }) => {
    let antdTheme = theme.useToken()
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    let [showDescriptionForm, setShowDescriptionForm] = useState(false)
    let [showNodeNameForm, setShowNodeNameForm] = useState(false)
    const showModal = () => {
        setIsModalOpen(true);
    };
    const contextMenuItems = [
        {
            key: '1',
            label: (
                <Typography.Text>
                    Add
                </Typography.Text>
            ),
            icon: <PlusOutlined />,
            onClick: addChild
        },
        {
            key: '2',
            label: 'Color',
            icon: <BgColorsOutlined />,
            children: [
                {
                    key: 'Default',
                    label: <div style={{ caretColor: "transparent", backgroundColor: antdTheme.token.colorFill, borderRadius: radiusAmount, height: 22, width: 48 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'Error',
                    label: <div style={{ caretColor: "transparent", backgroundColor: antdTheme.token.colorErrorHover, borderRadius: radiusAmount, height: 22, width: 48 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'Info',
                    label: <div style={{ caretColor: "transparent", backgroundColor: antdTheme.token.colorInfoHover, borderRadius: radiusAmount, height: 22, width: 48 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'Success',
                    label: <div style={{ caretColor: "transparent", backgroundColor: antdTheme.token.colorSuccessHover, borderRadius: radiusAmount, height: 22, width: 48 }}></div>,
                    onClick: handleReColorNode
                },
                {
                    key: 'Warning',
                    label: <div style={{ caretColor: "transparent", backgroundColor: antdTheme.token.colorWarningHover, borderRadius: radiusAmount, height: 22, width: 48 }}></div>,
                    onClick: handleReColorNode
                },
            ],
        },
        {
            key: '3',
            danger: true,
            icon: <DeleteOutlined />,
            label: 'Delete',
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
            let newNode = newNodeTemplate()
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
                                addChild()
                            }
                        }}
                        style={{
                            cursor: "pointer",
                            borderColor: node.nodeColor == "Default" ? antdTheme.token.colorTextSecondary : antdTheme.token[`color${node.nodeColor}BorderHover`],
                            width: node.showDescription ? 400 : cardWidth,
                            maxHeight: 400,
                            height: "auto",
                            // height: node.showDescription ? 400 : 48,
                            backgroundColor: node.nodeColor == "Default" ? antdTheme.token.colorFillQuaternary : antdTheme.token[`color${node.nodeColor}BgHover`],
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
                                name="basic"
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
                                <Typography.Text style={{ color: "inherit" }}
                                    // onClick={(e) => {
                                    //     if (e.shiftKey) {
                                    //         setShowNodeNameForm(true)
                                    //     }
                                    // }}

                                    onDoubleClick={() => { setShowNodeNameForm(true) }}
                                >{node.nodeName}</Typography.Text>
                        }
                        {
                            node.showDescription ?
                                <>
                                    <Divider size='large' style={{ margin: `${antdTheme.token.paddingSM}px 0` }} />
                                    {showDescriptionForm ?
                                        <Form
                                            name="basic"
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
                                                }} />
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
                <Typography.Text>All of its children will also be deleted</Typography.Text>
            </Modal>
        </>
    )
}

const FolderNode = ({ node, nodeType }) => {
    let antdTheme = theme.useToken()
    let lineColor = antdTheme.token.colorTextTertiary
    return (
        <>
            <Flex vertical={true} style={{ marginTop: nodeType == "mid" ? marginValue : 0 }}>
                <Flex>
                    <Flex className='LeftLine' vertical={true} style={{ minWidth: cardWidth / 2, minHeight: "100%" }}>
                        <div onClick={() => { toggleShowDescription(node, currentMap, setCurrentMap) }} style={{
                            caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                            borderBottom: nodeType == "bot" ? `1px solid ${lineColor}` : "",
                            borderLeft: nodeType == "bot" || nodeType == "mid" ? `1px solid ${lineColor}` : "",
                            borderRadius: nodeType == "bot" ? `0 0 0 ${radiusAmount}px` : ""
                        }}>

                        </div>
                        <div onClick={() => { toggleShowChildren(node, currentMap, setCurrentMap) }} style={{
                            caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                            borderTop: (nodeType == "top" || nodeType == "mid" || nodeType == "topFolder") ? `1px solid ${lineColor}` : "",
                            borderLeft: nodeType == "top" || nodeType == "mid" ? `1px solid ${lineColor}` : "",
                            borderRadius: nodeType == "top" ? `${radiusAmount}px 0 0 0` : ""
                        }}>
                        </div>
                    </Flex>
                    <div style={{ marginTop: nodeType == "bot" ? marginValue : 0 }}>
                        <NodeCard node={node} />
                    </div>
                </Flex>
                {
                    node?.children?.length > 0 && node?.showChildren ?
                        <>
                            <Flex>
                                <div style={{ caretColor: "transparent", minHeight: marginValue, width: cardWidth }} />
                                <div style={{ caretColor: "transparent", minHeight: marginValue, minWidth: cardWidth / 2, borderLeft: `1px solid ${lineColor}` }}>
                                    <EdgeComp node={node} />
                                </div>
                            </Flex>
                            <Flex>
                                <div style={{ caretColor: "transparent", minWidth: cardWidth, minHeight: "100%" }}></div>
                                <div style={{ caretColor: "transparent", borderLeft: `1px solid ${lineColor}`, minHeight: "100%" }}></div>
                                <Flex vertical={true}>
                                    {node.children.map((child, index) => {
                                        if (index < node.children.length - 1) {
                                            return (
                                                <FolderNode key={child.nodeID} node={child} nodeType={index == 0 ? "topFolder" : "mid"} />
                                            )
                                        }
                                    }
                                    )}
                                </Flex>
                            </Flex>
                            <Flex vertical>
                                <Flex>
                                    <div style={{ caretColor: "transparent", minWidth: cardWidth }} />

                                    <FolderNode node={node.children[node.children.length - 1]} nodeType={"bot"} />
                                </Flex>
                            </Flex>
                        </>
                        : <>
                        </>
                }
            </Flex>
        </ >
    )
}

const SpiderNode = ({ node, nodeType, childrenLength }) => {
    let antdTheme = theme.useToken()
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    let lineColor = antdTheme.token.colorTextTertiary
    return (
        <>
            <Flex className='SpiderNode'>
                <Flex vertical className='leftSection'>
                    <div style={{ borderLeft: `1px solid ${nodeType == 'top' || nodeType == 'root' || childrenLength == 1 ? '' : lineColor}`, flex: 1, minHeight: marginValue / 2 }} />
                    <Flex align='center' className='flexTest'>
                        <Flex className='SpiderLeftLine' vertical={true} style={{ minWidth: cardWidth / 2, minHeight: "100%" }}>
                            <div onClick={() => { toggleShowDescription(node, currentMap, setCurrentMap) }} style={{
                                caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                                borderBottom: nodeType == "bot" ? `1px solid ${lineColor}` : "",
                                borderLeft: nodeType != "top" && childrenLength > 1 ? `1px solid ${lineColor}` : "",
                                borderRadius: nodeType == "bot" ? `0 0 0 ${radiusAmount}px` : ""
                            }}>

                            </div>
                            <div onClick={() => { toggleShowChildren(node, currentMap, setCurrentMap) }} style={{
                                caretColor: "transparent", cursor: "pointer", flex: 1, minWidth: cardWidth / 2,
                                borderTop: nodeType != "bot" ? `1px solid ${lineColor}` : "",
                                borderLeft: nodeType != "bot" && childrenLength > 1 ? `1px solid ${lineColor}` : "",
                                borderRadius: nodeType == "top" ? `${radiusAmount}px 0 0 0` : ""
                            }}>
                            </div>
                        </Flex>
                        <div
                        // style={{ marginTop: marginValue / 2, marginBottom: marginValue / 2 }}
                        >
                            <NodeCard node={node} />
                        </div>
                    </Flex>
                    <div style={{ borderLeft: `1px solid ${nodeType == 'bot' || nodeType == 'root' || childrenLength == 1 ? '' : lineColor}`, flex: 1, minHeight: marginValue / 2 }} />
                </Flex>
                {node.children.length > 0 && node.showChildren ?
                    <Flex className='RightLine' vertical={true} style={{ minWidth: cardWidth / 2, minHeight: "100%" }}>
                        <div style={{
                            caretColor: "transparent", flex: 1, minWidth: cardWidth / 2, display: "flex", alignItems: "flex-end"
                        }}>
                            <EdgeComp node={node} />
                        </div>
                        <div style={{ caretColor: "transparent", flex: 1, minWidth: cardWidth / 2, borderTop: `1px solid ${lineColor}` }}>
                        </div>
                    </Flex>
                    : <></>}
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

const MindMap = () => {
    const { currentMap, setCurrentMap } = useContext(CurrentMapContext);
    const { modeTheme, setModeTheme } = useContext(ModeThemeContext);

    const [expandAll, setExpandAll] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [mapLayout, setMapLayout] = useState("spider")
    const [modalNew, setModalNew] = useState(false);

    let antdTheme = theme.useToken()
    let lineColor = antdTheme.token.colorTextTertiary
    let layoutMargin = 18
    function recursiveAll(currNode, currAtt, contentToModify) {
        currNode[currAtt] = contentToModify != null ? contentToModify : !currNode[currAtt]
        for (let child of currNode.children) {
            recursiveAll(child, currAtt, contentToModify != null ? contentToModify : null)
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
        recursiveAll(cloneMap, "showDescription", !showAll)
        setShowAll(!showAll)
        setCurrentMap(cloneMap)
    }
    function createNewMap() {
        let newRoot = newNodeTemplate()
        setModalNew(false)
        setCurrentMap(newRoot)
    }

    const downloadJson = () => {
        const jsonString = JSON.stringify(currentMap, null, 4); // formatted JSON
        const blob = new Blob([jsonString], { type: "application/json" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "map.json"; // filename
        link.click();

        URL.revokeObjectURL(url); // cleanup
    };
    function loadBackup() {
        let backupMap = JSON.parse(localStorage.getItem("backupMap"))
        setCurrentMap(backupMap)
    }
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
                    setCurrentMap(json)
                } catch (err) {

                }
            };
            reader.readAsText(file);

            // Prevent automatic upload
            return false;
        },
    };
    return (
        <>
            <Layout
                style={{
                    height: "100%",
                    padding: 0,
                    scrollbarColor: "red",
                    display: "flex",
                    flexDirection: "column"
                }}
            >
                <div className='layoutMenu' style={{
                    margin: `0 ${layoutMargin}px`,
                    height: 60,
                    borderBottom: `1px solid ${lineColor}`
                }}>
                    <Flex align='center' justify='space-between' style={{ height: "100%" }}>

                        <Flex align='center' style={{ height: "100%" }}>
                            <img height={24} src={`${window.location.href}/logo_${modeTheme}.png`} />
                            <Divider type='vertical' style={{ margin: `0 ${layoutMargin}px`, borderColor: lineColor, height: "64%" }} />
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
                                        <Upload {...uploadProps}>
                                            <Button variant='solid' color='default' icon={<UploadOutlined />}>Upload</Button>
                                        </Upload>
                                        <Button onClick={() => { setModalNew(true) }} variant="filled" color="default" icon={<PlusOutlined />}>
                                            New map
                                        </Button>
                                    </>
                                }
                            </Flex>
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
                                <Button onClick={loadBackup} variant='solid' color='default' shape="round" icon={<ReloadOutlined />}>
                                    Load backup
                                </Button>}
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
                <div className='insideWrapper' style={{ flex: 1, width: "100%", overflowX: "hidden", overflowY: "auto" }}>
                    <ZoomPanWrapper>
                        {currentMap ? <>
                            {
                                mapLayout == "spider" ? <SpiderNode node={currentMap} nodeType={"root"} childrenLength={currentMap.children.length} /> : <></>
                            }
                            {
                                mapLayout == "folder" ? <FolderNode node={currentMap} nodeType={"root"} childrenLength={currentMap.children.length} /> : <></>
                            }
                        </> : <></>}

                    </ZoomPanWrapper>
                </div>
                <Modal centered
                    title="Do you want to create a new map?"
                    closable={{ 'aria-label': 'Custom Close Button' }}
                    open={modalNew}
                    onOk={createNewMap}
                    onCancel={() => { setModalNew(false) }}
                >
                    <Typography.Text>If you create a new map, the current backup map will be deleted</Typography.Text>
                </Modal>
            </Layout>
        </>
    );
}

function App() {
    const [currentMap, setCurrentMap] = useState(null);
    let [modeTheme, setModeTheme] = useState("light")
    useEffect(() => {
        let modeThemeStorage = localStorage.getItem("modeTheme")
        if (modeThemeStorage == "dark") {
            localStorage.setItem("modeTheme", "dark")
            setModeTheme("dark")
        }
        else {
            localStorage.setItem("modeTheme", "light")
            setModeTheme("light")
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
            localStorage.setItem('backupMap', JSON.stringify(currentMap))
        }
    }, [currentMap])
    return (
        <>
            <ConfigProvider theme={{
                algorithm: modeTheme == "dark" ? theme.darkAlgorithm : theme.defaultAlgorithm
            }}>
                <ModeThemeContext.Provider value={{ modeTheme, setModeTheme }}>
                    <CurrentMapContext.Provider value={{ currentMap, setCurrentMap }}>
                        <MindMap />
                    </CurrentMapContext.Provider>
                </ModeThemeContext.Provider>
            </ConfigProvider>
        </>
    );
}

export default App;
