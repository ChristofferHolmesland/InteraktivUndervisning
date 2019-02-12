class Camera {
    constructor(graphDrawer) {
        this.gd = graphDrawer;
        this.canvas = graphDrawer.canvas;
        this.zoomLevel = 1;
        // The camera starts centered on the world.
        this.centerX = this.gd.drawBuffer.width / 2;
        this.centerY = this.gd.drawBuffer.height / 2;
        // This determines the dimensions of the camera view.
        // For simplicity it should be the same as the canvas
        // where the world is rendered.
        this.viewportWidth = this.canvas.width;
        this.viewportHeight = this.canvas.height;
    }
    
    /* 
        Determines if an object is inside the camera frustum.
        Returns true if the object was culled (removed).

        Culling rule:
            Cull edge if n1 and n2 is culled.
            Cull node if a square with side length R centered at (node.x, node.y)
            doesn't overlap the viewport.
    */
    cull(object, isNode) {
        if (isNode) {
            return this._cullNode(object);
        }

        this._cullNode(object.n1);
        this._cullNode(object.n2);
        return object.n1.culled && object.n2.culled;
    }

    /*
        Determines if a given node is culled.
    */
    _cullNode(node) {
        if (node.culled != undefined) return node.culled;
        
        // RectA and RectB objects can be removed if they're too slow.
        let RectA = this.getFrustumFront();
        let RectB = {};
        RectB.Left = node.x - (node.r / 2);
        RectB.Right = node.x + (node.r / 2);
        RectB.Top = node.y - (node.r / 2);
        RectB.Bottom = node.y + (node.r / 2);

        // TODO Make the culling work better with square nodes

        // ref: (modified for our coordinate system)
        // https://stackoverflow.com/questions/306316/determine-if-two-rectangles-overlap-each-other
        node.culled = !(RectA.Left < RectB.Right && RectA.Right > RectB.Left &&
            RectA.Top < RectB.Bottom && RectA.Bottom > RectB.Top);
        return node.culled;
    }

    /*
        Calculates and returns a rectangle representing the front plane
        off the camera frustum. Back plane isn't needed because
        front dimensions == back dimensions, and we're working in 2D space.
    */
    getFrustumFront() {
        let RectA = {};
        RectA.Left = this.centerX - this.zoomLevel * (this.viewportWidth / 2);
        RectA.Right = this.centerX + this.zoomLevel * (this.viewportWidth / 2);
        RectA.Top = this.centerY - this.zoomLevel * (this.viewportHeight / 2);
        RectA.Bottom = this.centerY + this.zoomLevel * (this.viewportHeight / 2);
        RectA.Width = RectA.Right - RectA.Left;
        RectA.Height = RectA.Bottom - RectA.Top;
        return RectA;
    }

    /*
        Converts canvas coordinates to world coordinates.
    */
    project(x, y) {
        let frustum = this.getFrustumFront();
        let worldX = (x / this.canvas.width) * frustum.Width + frustum.Left;
        let worldY = (y / this.canvas.height) * frustum.Height + frustum.Top;
        return { x: worldX, y: worldY };
    }

    /*
        Converts world coordinates to canvas coordinates
    */
    unproject(x, y) {
        let frustum = this.getFrustumFront();
        
        let cameraSpaceX = x - frustum.Left;
        let cameraSpaceY = y - frustum.Top;
        let canvasX = canvas.width * (cameraSpaceX / frustum.Width);
        let canvasY = canvas.height * (cameraSpaceY / frustum.Height);
        
        return { x: canvasX, y: canvasY };
    }

    /*
        Changes which x coordinate the camera looks at.
        Bound in range (0, drawBuffer width).
    */
    translateX(x, min, max) {
        this.centerX += x;
        if (this.centerX < min) this.centerX = min;
        else if (this.centerX > max) this.centerX = max;
    }

    /*
        Changes which y coordinate the camera looks at.
        Bound in range (0, drawBuffer height).
    */
   translateY(y, min, max) {
        this.centerY += y;
        if (this.centerY < min) this.centerY = min;
        else if (this.centerY > max) this.centerY = max;
   }
}